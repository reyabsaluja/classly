import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { supabase, type DatabaseStudent, type DatabaseGroup } from "./supabase"

export interface Student {
  id: string
  name: string
  email: string
  grade: number | null
  notes: string
  tags: string[]
  groupId?: string
  position?: { x: number; y: number }
  avatar: string
}

export interface Group {
  id: string
  name: string
  color: string
  studentIds: string[]
}

interface StudentStore {
  students: Student[]
  groups: Group[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchStudents: () => Promise<void>
  fetchGroups: () => Promise<void>
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>
  addStudent: (student: Omit<Student, "id">) => Promise<void>
  searchStudents: (query: string) => Student[]
  filterByTag: (tag: string) => Student[]
  moveStudentToGroup: (studentId: string, groupId: string) => Promise<void>
  createGroup: (name: string, color: string) => Promise<void>
  updateGroup: (id: string, updates: Partial<Group>) => Promise<void>

  // Utility functions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Transform database student to app student
const transformStudent = (dbStudent: DatabaseStudent): Student => ({
  id: dbStudent.id,
  name: dbStudent.name,
  email: dbStudent.email,
  grade: dbStudent.grade,
  notes: dbStudent.notes || "",
  tags: dbStudent.tags || [],
  groupId: dbStudent.group_id || undefined,
  position:
    dbStudent.position_x !== null && dbStudent.position_y !== null
      ? { x: dbStudent.position_x, y: dbStudent.position_y }
      : undefined,
  avatar: dbStudent.avatar_url || "/placeholder.svg?height=40&width=40",
})

// Transform database group to app group
const transformGroup = (dbGroup: DatabaseGroup, students: Student[]): Group => ({
  id: dbGroup.id,
  name: dbGroup.name,
  color: dbGroup.color,
  studentIds: students.filter((s) => s.groupId === dbGroup.id).map((s) => s.id),
})

export const useStudentStore = create<StudentStore>()(
  devtools(
    (set, get) => ({
      students: [],
      groups: [],
      isLoading: false,
      error: null,

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      fetchStudents: async () => {
        try {
          set({ isLoading: true, error: null })

          const { data, error } = await supabase.from("students").select("*").order("name")

          if (error) throw error

          const students = data.map(transformStudent)
          set({ students, isLoading: false })
        } catch (error) {
          console.error("Error fetching students:", error)
          set({ error: "Failed to fetch students", isLoading: false })
        }
      },

      fetchGroups: async () => {
        try {
          const { data, error } = await supabase.from("groups").select("*").order("name")

          if (error) throw error

          const { students } = get()
          const groups = data.map((dbGroup) => transformGroup(dbGroup, students))
          set({ groups })
        } catch (error) {
          console.error("Error fetching groups:", error)
          set({ error: "Failed to fetch groups" })
        }
      },

      updateStudent: async (id, updates) => {
        try {
          // Validate group exists if groupId is being updated (but allow null/undefined for ungrouped)
          if (updates.groupId !== undefined && updates.groupId !== null) {
            const { groups } = get()
            const groupExists = groups.some((group) => group.id === updates.groupId)
            if (!groupExists) {
              throw new Error(`Group with ID ${updates.groupId} does not exist`)
            }
          }

          // Optimistic update
          set((state) => ({
            students: state.students.map((student) => (student.id === id ? { ...student, ...updates } : student)),
          }))

          // Prepare database updates
          const dbUpdates: Partial<DatabaseStudent> = {}
          if (updates.name !== undefined) dbUpdates.name = updates.name
          if (updates.email !== undefined) dbUpdates.email = updates.email
          if (updates.grade !== undefined) dbUpdates.grade = updates.grade
          if (updates.notes !== undefined) dbUpdates.notes = updates.notes
          if (updates.tags !== undefined) dbUpdates.tags = updates.tags
          if (updates.groupId !== undefined) dbUpdates.group_id = updates.groupId || null
          if (updates.position !== undefined) {
            dbUpdates.position_x = updates.position?.x || null
            dbUpdates.position_y = updates.position?.y || null
          }

          const { error } = await supabase.from("students").update(dbUpdates).eq("id", id)

          if (error) throw error

          // Refresh groups if group assignment changed
          if (updates.groupId !== undefined) {
            get().fetchGroups()
          }
        } catch (error) {
          console.error("Error updating student:", error)
          // Revert optimistic update
          get().fetchStudents()
          set({ error: `Failed to update student: ${error.message}` })
        }
      },

      addStudent: async (student) => {
        try {
          // Validate group exists if groupId is provided
          if (student.groupId) {
            const { groups } = get()
            const groupExists = groups.some((group) => group.id === student.groupId)
            if (!groupExists) {
              throw new Error(`Group with ID ${student.groupId} does not exist`)
            }
          }

          const { data, error } = await supabase
            .from("students")
            .insert({
              name: student.name,
              email: student.email,
              grade: student.grade,
              notes: student.notes,
              tags: student.tags,
              group_id: student.groupId || null,
              position_x: student.position?.x || null,
              position_y: student.position?.y || null,
              avatar_url: student.avatar,
            })
            .select()
            .single()

          if (error) throw error

          const newStudent = transformStudent(data)
          set((state) => ({
            students: [...state.students, newStudent],
          }))

          // Refresh groups
          get().fetchGroups()
        } catch (error) {
          console.error("Error adding student:", error)
          set({ error: `Failed to add student: ${error.message}` })
        }
      },

      searchStudents: (query) => {
        const { students } = get()
        const lowercaseQuery = query.toLowerCase()
        return students.filter(
          (student) =>
            student.name.toLowerCase().includes(lowercaseQuery) ||
            student.email.toLowerCase().includes(lowercaseQuery) ||
            student.notes.toLowerCase().includes(lowercaseQuery) ||
            student.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
        )
      },

      filterByTag: (tag) => {
        const { students } = get()
        return students.filter((student) => student.tags.includes(tag))
      },

      moveStudentToGroup: async (studentId, groupId) => {
        try {
          // Handle ungrouped case
          let finalGroupId: string | undefined = undefined

          if (groupId !== "ungrouped") {
            // Verify the group exists
            const { groups } = get()
            const groupExists = groups.some((group) => group.id === groupId)
            if (!groupExists) {
              throw new Error(`Group with ID ${groupId} does not exist`)
            }
            finalGroupId = groupId
          }

          await get().updateStudent(studentId, { groupId: finalGroupId })
        } catch (error) {
          console.error("Error moving student to group:", error)
          set({ error: `Failed to move student to group: ${error.message}` })
        }
      },

      createGroup: async (name, color) => {
        try {
          const { data, error } = await supabase
            .from("groups")
            .insert({
              name,
              color,
            })
            .select()
            .single()

          if (error) throw error

          const { students } = get()
          const newGroup = transformGroup(data, students)
          set((state) => ({
            groups: [...state.groups, newGroup],
          }))
        } catch (error) {
          console.error("Error creating group:", error)
          set({ error: `Failed to create group: ${error.message}` })
        }
      },

      updateGroup: async (id, updates) => {
        try {
          // Optimistic update
          set((state) => ({
            groups: state.groups.map((group) => (group.id === id ? { ...group, ...updates } : group)),
          }))

          const dbUpdates: Partial<DatabaseGroup> = {}
          if (updates.name !== undefined) dbUpdates.name = updates.name
          if (updates.color !== undefined) dbUpdates.color = updates.color

          const { error } = await supabase.from("groups").update(dbUpdates).eq("id", id)

          if (error) throw error
        } catch (error) {
          console.error("Error updating group:", error)
          // Revert optimistic update
          get().fetchGroups()
          set({ error: `Failed to update group: ${error.message}` })
        }
      },
    }),
    { name: "student-store" },
  ),
)
