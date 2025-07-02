"use client"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Student } from "@/lib/store"
import { useStudentStore } from "@/lib/store"
import StudentCard from "@/components/student-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface GroupContainerProps {
  id: string
  title: string
  color: string
  students: Student[]
  isEditable?: boolean
  isOver?: boolean
}

export default function GroupContainer({
  id,
  title,
  color,
  students,
  isEditable = false,
  isOver = false,
}: GroupContainerProps) {
  const { updateGroup } = useStudentStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)

  const { setNodeRef } = useDroppable({
    id,
  })

  const handleSaveTitle = async () => {
    if (isEditable && editTitle.trim() && editTitle.trim() !== title) {
      try {
        await updateGroup(id, { name: editTitle.trim() })
        setIsEditing(false)
      } catch (error) {
        console.error("Failed to update group name:", error)
        setEditTitle(title) // Revert on error
      }
    } else {
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(title)
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-2 border-dashed rounded-lg p-4 min-h-[300px] transition-all",
        color,
        isOver && "ring-2 ring-blue-500 ring-opacity-50 scale-105",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-sm font-medium"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle()
                if (e.key === "Escape") handleCancelEdit()
              }}
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleSaveTitle}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{title}</h3>
            {isEditable && (
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="p-1 h-auto">
                <Edit2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">{students.length}</span>
      </div>

      {/* Students */}
      <SortableContext items={students.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Drop students here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
