"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Student } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface StudentCardProps {
  student: Student
  isDragging?: boolean
}

export default function StudentCard({ student, isDragging = false }: StudentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: student.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return "text-gray-400"
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600"
    if (grade >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      "honor-roll": "bg-green-100 text-green-800",
      "needs-support": "bg-yellow-100 text-yellow-800",
      absent: "bg-red-100 text-red-800",
      active: "bg-blue-100 text-blue-800",
      leader: "bg-purple-100 text-purple-800",
      creative: "bg-pink-100 text-pink-800",
      improving: "bg-indigo-100 text-indigo-800",
      analytical: "bg-teal-100 text-teal-800",
      quiet: "bg-gray-100 text-gray-800",
      "makeup-needed": "bg-orange-100 text-orange-800",
    }
    return colors[tag] || "bg-gray-100 text-gray-800"
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all cursor-grab",
        (isDragging || isSortableDragging) && "opacity-50 rotate-2 shadow-lg",
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />

        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
          <AvatarFallback className="text-xs">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 truncate">{student.name}</h4>
            <span className={cn("text-sm font-medium", getGradeColor(student.grade))}>
              {student.grade !== null ? `${student.grade}%` : "N/A"}
            </span>
          </div>

          {student.notes && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{student.notes}</p>}

          {student.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {student.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className={cn("text-xs px-1 py-0", getTagColor(tag))}>
                  {tag.replace("-", " ")}
                </Badge>
              ))}
              {student.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  +{student.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
