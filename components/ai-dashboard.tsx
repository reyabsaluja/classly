"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  TrendingUp,
  Users,
  MessageSquare,
  Lightbulb,
  Target,
  Heart,
  Zap,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Key,
  CheckCircle,
} from "lucide-react"
import { useStudentStore } from "@/lib/store"
import { aiTeachingAssistant, type GradePrediction, type GroupSuggestion, type LearningInsight } from "@/lib/ai-service"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function AIDashboard() {
  const { students } = useStudentStore()
  const [predictions, setPredictions] = useState<GradePrediction[]>([])
  const [groupSuggestions, setGroupSuggestions] = useState<GroupSuggestion[]>([])
  const [insights, setInsights] = useState<LearningInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("predictions")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const apiStatus = aiTeachingAssistant.getAPIStatus()

  const generatePredictions = async () => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const newPredictions = await aiTeachingAssistant.predictGrades(students, "Upcoming math assessment")
      setPredictions(newPredictions)
      setSuccessMessage(`Generated ${newPredictions.length} predictions successfully!`)
    } catch (error) {
      console.error("Error generating predictions:", error)
      setError(error.message || "Failed to generate predictions")
    } finally {
      setIsLoading(false)
    }
  }

  const generateGroupSuggestions = async () => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const suggestions = await aiTeachingAssistant.suggestOptimalGroups(students, "collaborative")
      setGroupSuggestions(suggestions)
      setSuccessMessage(`Generated ${suggestions.length} group suggestions successfully!`)
    } catch (error) {
      console.error("Error generating group suggestions:", error)
      setError(error.message || "Failed to generate group suggestions")
    } finally {
      setIsLoading(false)
    }
  }

  const generateInsights = async () => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const allInsights: LearningInsight[] = []
      for (const student of students.slice(0, 3)) {
        // Limit for demo
        const studentInsights = await aiTeachingAssistant.analyzeLearningTrajectory(student)
        allInsights.push(...studentInsights)
      }
      setInsights(allInsights)
      setSuccessMessage(`Generated ${allInsights.length} learning insights successfully!`)
    } catch (error) {
      console.error("Error generating insights:", error)
      setError(error.message || "Failed to generate insights")
    } finally {
      setIsLoading(false)
    }
  }

  const generateAllInsights = async () => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Generate all insights in parallel for better UX
      const [newPredictions, suggestions, allInsights] = await Promise.all([
        aiTeachingAssistant.predictGrades(students, "Upcoming assessment"),
        aiTeachingAssistant.suggestOptimalGroups(students, "collaborative"),
        Promise.all(students.slice(0, 3).map((student) => aiTeachingAssistant.analyzeLearningTrajectory(student))).then(
          (results) => results.flat(),
        ),
      ])

      setPredictions(newPredictions)
      setGroupSuggestions(suggestions)
      setInsights(allInsights)

      setSuccessMessage(
        `Successfully generated: ${newPredictions.length} predictions, ${suggestions.length} group suggestions, and ${allInsights.length} insights!`,
      )
    } catch (error) {
      console.error("Error generating all insights:", error)
      setError(error.message || "Failed to generate insights")
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trajectory":
        return TrendingUp
      case "engagement":
        return Zap
      case "behavior":
        return Heart
      case "social":
        return Users
      default:
        return Lightbulb
    }
  }

  return (
    <div className="space-y-6">
      {/* API Status Alert */}
      {!apiStatus.available && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Demo Mode:</strong> AI features are running with intelligent rule-based algorithms.
                <span className="ml-1">Add your OpenAI API key for advanced AI capabilities.</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/api-setup">
                  <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                    <Key className="w-4 h-4 mr-1" />
                    Setup API Key
                  </Button>
                </Link>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 flex items-center justify-between">
            {successMessage}
            <Button variant="ghost" size="sm" onClick={() => setSuccessMessage(null)} className="text-green-600">
              ✕
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={() => setError(null)} className="ml-4">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Teaching Assistant</h2>
            <p className="text-gray-600">
              {apiStatus.available
                ? "Intelligent insights powered by OpenAI"
                : "Smart classroom insights using advanced algorithms"}
            </p>
          </div>
        </div>
        <Button onClick={generateAllInsights} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Generate {apiStatus.available ? "AI" : "Smart"} Insights
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">At Risk Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {predictions.filter((p) => p.riskLevel === "high").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Optimal Groups</p>
                <p className="text-2xl font-bold text-gray-900">{groupSuggestions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Learning Insights</p>
                <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {predictions.length > 0
                    ? Math.round((predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Grade Predictions</TabsTrigger>
          <TabsTrigger value="groups">Smart Grouping</TabsTrigger>
          <TabsTrigger value="insights">Learning Insights</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Grade Predictions & Risk Assessment
              </CardTitle>
              <CardDescription>
                {apiStatus.available
                  ? "AI-powered analysis of student performance patterns and risk factors"
                  : "Intelligent rule-based analysis of student performance patterns"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Click "Generate Smart Insights" to see predictions</p>
                  <Button onClick={generatePredictions} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Target className="w-4 h-4 mr-2" />
                    )}
                    Generate Predictions
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((prediction) => {
                    const student = students.find((s) => s.id === prediction.studentId)
                    if (!student) return null

                    return (
                      <div key={prediction.studentId} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-600">Current: {student.grade || "No grade"}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">Predicted: {prediction.predictedGrade}%</p>
                            <Badge className={cn("text-xs", getRiskColor(prediction.riskLevel))}>
                              {prediction.riskLevel} risk
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Confidence</span>
                            <span>{Math.round(prediction.confidence * 100)}%</span>
                          </div>
                          <Progress value={prediction.confidence * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-gray-700">{prediction.reasoning}</p>

                          {prediction.interventions.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Recommended Interventions:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {prediction.interventions.map((intervention, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    {intervention}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Intelligent Group Suggestions
              </CardTitle>
              <CardDescription>
                {apiStatus.available
                  ? "AI-optimized student groupings for collaborative learning"
                  : "Algorithm-based student groupings for collaborative learning"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groupSuggestions.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Generate insights to see group suggestions</p>
                  <Button onClick={generateGroupSuggestions} disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                    Generate Groups
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupSuggestions.map((suggestion, index) => (
                    <div key={suggestion.groupId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Group {index + 1}</h4>
                          <p className="text-sm text-gray-600">{suggestion.students.length} students</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Effectiveness</span>
                            <Badge variant="secondary">{Math.round(suggestion.effectiveness * 100)}%</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {suggestion.students.map((student) => (
                            <Badge key={student.id} variant="outline" className="text-xs">
                              {student.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700">{suggestion.reasoning}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Learning Trajectory Insights
              </CardTitle>
              <CardDescription>
                {apiStatus.available
                  ? "Deep AI analysis of student learning patterns and development"
                  : "Intelligent analysis of student learning patterns and development"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights.length === 0 ? (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Generate insights to see learning analysis</p>
                  <Button onClick={generateInsights} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Lightbulb className="w-4 h-4 mr-2" />
                    )}
                    Generate Insights
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight, index) => {
                    const Icon = getInsightIcon(insight.type)
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{insight.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(insight.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{insight.description}</p>

                            {insight.actionItems.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-900 mb-1">Action Items:</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {insight.actionItems.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-2">
                                      <span className="text-green-600 mt-1">✓</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Smart Communications
              </CardTitle>
              <CardDescription>
                {apiStatus.available
                  ? "AI-generated parent communications and conference talking points"
                  : "Template-based parent communications and talking points"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Select a student to generate personalized parent communication</p>
                <Button variant="outline">Generate Sample Communication</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
