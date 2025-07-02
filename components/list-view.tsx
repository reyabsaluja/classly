"use client"

import { useState } from "react"
import type { Student } from "@/lib/store"
import { useStudentStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ListViewProps {
  students: Student[]
}

export default function ListView({ students }: ListViewProps) {
  const { updateStudent } = useStudentStore()
  const [editingField, setEditingField] = useState<string | null>(null)

  const handleFieldEdit = (studentId: string, field: keyof Student, value: any) => {
    updateStudent(studentId, { [field]: value })
    setEditingField(null)
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr
                key={student.id}
                className={cn("hover:bg-gray-50 transition-colors", index % 2 === 0 ? "bg-white" : "bg-gray-25")}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingField === `${student.id}-grade` ? (
                    <Input
                      type="number"
                      defaultValue={student.grade || ""}
                      className="w-20"
                      onBlur={(e) =>
                        handleFieldEdit(student.id, "grade", e.target.value ? Number.parseInt(e.target.value) : null)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFieldEdit(
                            student.id,
                            "grade",
                            e.currentTarget.value ? Number.parseInt(e.currentTarget.value) : null,
                          )
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <div
                      className={cn(
                        "text-sm font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded",
                        getGradeColor(student.grade),
                      )}
                      onClick={() => setEditingField(`${student.id}-grade`)}
                    >
                      {student.grade !== null ? `${student.grade}%` : "No grade"}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingField === `${student.id}-notes` ? (
                    <Textarea
                      defaultValue={student.notes}
                      className="min-h-[60px]"
                      onBlur={(e) => handleFieldEdit(student.id, "notes", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleFieldEdit(student.id, "notes", e.currentTarget.value)
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded max-w-xs"
                      onClick={() => setEditingField(`${student.id}-notes`)}
                    >
                      {student.notes || "Click to add notes..."}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {student.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className={cn("text-xs", getTagColor(tag))}>
                        {tag.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
