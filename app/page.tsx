"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, List, Grid3X3, Users, Loader2, AlertCircle, Brain, Heart } from "lucide-react"
import { useStudentStore } from "@/lib/store"
import ListView from "@/components/list-view"
import GroupView from "@/components/group-view"
import GridView from "@/components/grid-view"
import { cn } from "@/lib/utils"
import AddStudentDialog from "@/components/add-student-dialog"

// Add this import at the top
import { useRealtimeSubscriptions } from "@/lib/realtime"

// Add these imports at the top
import AIDashboard from "@/components/ai-dashboard"
import MoodTracker from "@/components/mood-tracker"
import SetupBanner from "@/components/setup-banner"

type ViewMode = "list" | "group" | "grid" | "ai" | "mood"

export default function ClasslyDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")

  const { students, groups, isLoading, error, searchStudents, fetchStudents, fetchGroups, setError } = useStudentStore()

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchStudents()
      await fetchGroups()
    }
    loadData()
  }, [fetchStudents, fetchGroups])

  // Add this hook call inside the component, after the existing useEffect:
  // Enable real-time subscriptions
  useRealtimeSubscriptions()

  const filteredStudents = searchQuery ? searchStudents(searchQuery) : students

  // Update the view icons object to include new views
  const viewIcons = {
    list: List,
    group: Users,
    grid: Grid3X3,
    ai: Brain,
    mood: Heart,
  }

  if (isLoading && students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your classroom...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Classly</h1>
            <Badge variant="secondary" className="text-xs">
              {filteredStudents.length} students
            </Badge>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            {/* Update the view toggle section to include AI and Mood views */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(["list", "group", "grid", "ai", "mood"] as ViewMode[]).map((mode) => {
                const Icon = viewIcons[mode]
                return (
                  <Button
                    key={mode}
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "px-3 py-2 rounded-md transition-all",
                      viewMode === mode ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                )
              })}
            </div>
          </div>
          <AddStudentDialog />
        </div>
      </header>

      {/* Setup Banner */}
      <SetupBanner />

      {/* Error Alert */}
      {error && (
        <div className="px-6 py-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="outline" size="sm" onClick={() => setError(null)} className="ml-4">
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6">
        {/* Update the main content section to include the new views */}
        {viewMode === "list" && <ListView students={filteredStudents} />}
        {viewMode === "group" && <GroupView students={filteredStudents} />}
        {viewMode === "grid" && <GridView students={filteredStudents} />}
        {viewMode === "ai" && <AIDashboard />}
        {viewMode === "mood" && <MoodTracker />}
      </main>
    </div>
  )
}
