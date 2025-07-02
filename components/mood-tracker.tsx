"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Smile, Meh, Frown, Angry, Zap, Battery, BatteryLow } from "lucide-react"
import { useStudentStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const moodEmojis = [
  { emoji: "😊", value: "happy", icon: Smile, color: "text-green-600 bg-green-100" },
  { emoji: "😐", value: "neutral", icon: Meh, color: "text-yellow-600 bg-yellow-100" },
  { emoji: "😔", value: "sad", icon: Frown, color: "text-blue-600 bg-blue-100" },
  { emoji: "😤", value: "frustrated", icon: Angry, color: "text-red-600 bg-red-100" },
  { emoji: "😴", value: "tired", icon: BatteryLow, color: "text-gray-600 bg-gray-100" },
]

const energyLevels = [
  { level: 1, icon: BatteryLow, label: "Very Low", color: "text-red-600" },
  { level: 2, icon: BatteryLow, label: "Low", color: "text-orange-600" },
  { level: 3, icon: Battery, label: "Medium", color: "text-yellow-600" },
  { level: 4, icon: Battery, label: "High", color: "text-green-600" },
  { level: 5, icon: Zap, label: "Very High", color: "text-blue-600" },
]

export default function MoodTracker() {
  const { students } = useStudentStore()
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [energyLevel, setEnergyLevel] = useState<number>(3)
  const [stressLevel, setStressLevel] = useState<number>(2)
  const [notes, setNotes] = useState<string>("")

  const handleSubmitMoodCheck = async () => {
    if (!selectedStudent || !selectedMood) return

    // Here you would save to Supabase
    console.log("Mood check-in:", {
      studentId: selectedStudent,
      mood: selectedMood,
      energy: energyLevel,
      stress: stressLevel,
      notes,
    })

    // Reset form
    setSelectedStudent("")
    setSelectedMood("")
    setEnergyLevel(3)
    setStressLevel(2)
    setNotes("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            Daily Mood Check-In
          </CardTitle>
          <CardDescription>Track student emotional well-being and energy levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Student Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Student</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {students.map((student) => (
                <Button
                  key={student.id}
                  variant={selectedStudent === student.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStudent(student.id)}
                  className="justify-start"
                >
                  {student.name}
                </Button>
              ))}
            </div>
          </div>

          {selectedStudent && (
            <>
              {/* Mood Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">How are you feeling today?</label>
                <div className="grid grid-cols-5 gap-3">
                  {moodEmojis.map((mood) => {
                    const Icon = mood.icon
                    return (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all text-center",
                          selectedMood === mood.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <div className="text-3xl mb-2">{mood.emoji}</div>
                        <Icon className={cn("w-4 h-4 mx-auto mb-1", mood.color.split(" ")[0])} />
                        <div className="text-xs font-medium capitalize">{mood.value}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Energy Level</label>
                <div className="grid grid-cols-5 gap-2">
                  {energyLevels.map((energy) => {
                    const Icon = energy.icon
                    return (
                      <button
                        key={energy.level}
                        onClick={() => setEnergyLevel(energy.level)}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all text-center",
                          energyLevel === energy.level
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <Icon className={cn("w-5 h-5 mx-auto mb-1", energy.color)} />
                        <div className="text-xs font-medium">{energy.label}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Stress Level */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Stress Level: {stressLevel}/5</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setStressLevel(level)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        stressLevel >= level ? "bg-red-500 border-red-500" : "border-gray-300 hover:border-gray-400",
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else you'd like to share about how you're feeling?"
                  rows={3}
                />
              </div>

              {/* Submit */}
              <Button onClick={handleSubmitMoodCheck} disabled={!selectedMood} className="w-full">
                Submit Check-In
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Mood Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Classroom Mood Overview</CardTitle>
          <CardDescription>Recent emotional well-being trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Mood data will appear here after check-ins are completed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
