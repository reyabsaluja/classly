"use client"

import { useState } from "react"
import type { Student } from "@/lib/store"
import { useStudentStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface GridViewProps {
  students: Student[]
}

export default function GridView({ students }: GridViewProps) {
  const { updateStudent } = useStudentStore()
  const [selectedSeats, setSelectedSeats] = useState<Set<number>>(new Set())

  // Create a 6x6 grid (36 seats)
  const totalSeats = 36
  const seatsPerRow = 6

  // Create seat assignments
  const seatAssignments = new Map<number, Student>()
  students.forEach((student, index) => {
    if (index < totalSeats) {
      seatAssignments.set(index, student)
    }
  })

  const handleSeatClick = (seatIndex: number) => {
    const newSelected = new Set(selectedSeats)
    if (newSelected.has(seatIndex)) {
      newSelected.delete(seatIndex)
    } else {
      newSelected.add(seatIndex)
    }
    setSelectedSeats(newSelected)
  }

  const shuffleSeats = () => {
    const availableSeats = Array.from({ length: totalSeats }, (_, i) => i)
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5)

    shuffledStudents.forEach((student, index) => {
      if (index < totalSeats) {
        updateStudent(student.id, {
          position: {
            x: index % seatsPerRow,
            y: Math.floor(index / seatsPerRow),
          },
        })
      }
    })
  }

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return "border-gray-300"
    if (grade >= 90) return "border-green-400"
    if (grade >= 80) return "border-blue-400"
    if (grade >= 70) return "border-yellow-400"
    return "border-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Seating Chart</h2>
          <Badge variant="secondary">
            {students.length} / {totalSeats} seats
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={shuffleSeats}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Shuffle Seats
          </Button>
          {selectedSeats.size > 0 && (
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Group Selected ({selectedSeats.size})
            </Button>
          )}
        </div>
      </div>

      {/* Classroom Layout */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Teacher's Desk */}
        <div className="mb-8">
          <div className="bg-gray-800 text-white text-center py-3 rounded-lg font-medium">{"Teacher's Desk"}</div>
        </div>

        {/* Seating Grid */}
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: totalSeats }, (_, index) => {
            const student = seatAssignments.get(index)
            const isSelected = selectedSeats.has(index)

            return (
              <div
                key={index}
                onClick={() => handleSeatClick(index)}
                className={cn(
                  "aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all hover:shadow-md",
                  student ? "bg-white" : "bg-gray-50 border-dashed",
                  student && getGradeColor(student.grade),
                  isSelected && "ring-2 ring-blue-500 ring-opacity-50",
                  !student && "border-gray-300",
                )}
              >
                {student ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Avatar className="h-8 w-8 mb-1">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback className="text-xs">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs font-medium text-gray-900 truncate w-full">
                      {student.name.split(" ")[0]}
                    </div>
                    {student.grade !== null && <div className="text-xs text-gray-600">{student.grade}%</div>}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-xs text-gray-400">Empty</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-green-400 rounded"></div>
              <span>90%+ (A)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-400 rounded"></div>
              <span>80-89% (B)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-yellow-400 rounded"></div>
              <span>70-79% (C)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-red-400 rounded"></div>
              <span>Below 70%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-gray-300 rounded"></div>
              <span>No Grade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
