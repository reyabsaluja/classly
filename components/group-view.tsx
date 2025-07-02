"use client"

import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  type DragOverEvent,
} from "@dnd-kit/core"
import type { Student } from "@/lib/store"
import { useStudentStore } from "@/lib/store"
import StudentCard from "@/components/student-card"
import GroupContainer from "@/components/group-container"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"

interface GroupViewProps {
  students: Student[]
}

export default function GroupView({ students }: GroupViewProps) {
  const { groups, moveStudentToGroup, createGroup, isLoading } = useStudentStore()
  const [activeStudent, setActiveStudent] = useState<Student | null>(null)
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [overId, setOverId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const student = students.find((s) => s.id === event.active.id)
    setActiveStudent(student || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setOverId(over ? (over.id as string) : null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const studentId = active.id as string
      let targetGroupId = over.id as string

      // Check if we're dropping on a student card instead of a group container
      const targetStudent = students.find((s) => s.id === targetGroupId)
      if (targetStudent) {
        // If dropping on a student, use that student's group (or ungrouped)
        targetGroupId = targetStudent.groupId || "ungrouped"
      }

      // Validate that we have a valid group ID or "ungrouped"
      const validGroupIds = ["ungrouped", ...groups.map((g) => g.id)]
      if (!validGroupIds.includes(targetGroupId)) {
        console.warn(`Invalid drop target: ${targetGroupId}`)
        setActiveStudent(null)
        setOverId(null)
        return
      }

      try {
        await moveStudentToGroup(studentId, targetGroupId)
      } catch (error) {
        console.error("Failed to move student:", error)
      }
    }

    setActiveStudent(null)
    setOverId(null)
  }

  const ungroupedStudents = students.filter(
    (student) => !student.groupId || !groups.some((group) => group.id === student.groupId),
  )

  const handleCreateGroup = async () => {
    setIsCreatingGroup(true)
    try {
      const colors = [
        "bg-blue-100 border-blue-300",
        "bg-green-100 border-green-300",
        "bg-purple-100 border-purple-300",
        "bg-pink-100 border-pink-300",
        "bg-indigo-100 border-indigo-300",
        "bg-teal-100 border-teal-300",
        "bg-orange-100 border-orange-300",
      ]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      await createGroup(`New Group ${groups.length + 1}`, randomColor)
    } catch (error) {
      console.error("Failed to create group:", error)
    } finally {
      setIsCreatingGroup(false)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Organize Students into Groups</h2>
          <Button onClick={handleCreateGroup} disabled={isCreatingGroup} className="flex items-center gap-2">
            {isCreatingGroup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create Group
          </Button>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ungrouped Students */}
          <GroupContainer
            id="ungrouped"
            title="Ungrouped Students"
            color="bg-gray-100 border-gray-300"
            students={ungroupedStudents}
            isOver={overId === "ungrouped"}
          />

          {/* Existing Groups */}
          {groups.map((group) => {
            const groupStudents = students.filter((student) => student.groupId === group.id)
            return (
              <GroupContainer
                key={group.id}
                id={group.id}
                title={group.name}
                color={group.color}
                students={groupStudents}
                isEditable
                isOver={overId === group.id}
              />
            )
          })}
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-gray-600 mt-2">Updating groups...</p>
          </div>
        )}
      </div>

      <DragOverlay>{activeStudent ? <StudentCard student={activeStudent} isDragging /> : null}</DragOverlay>
    </DndContext>
  )
}
