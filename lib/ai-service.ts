import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import type { Student } from "./store"

export interface GradePrediction {
  studentId: string
  predictedGrade: number
  confidence: number
  riskLevel: "low" | "medium" | "high"
  interventions: string[]
  reasoning: string
}

export interface GroupSuggestion {
  groupId: string
  students: Student[]
  reasoning: string
  effectiveness: number
  purpose: "collaborative" | "peer_tutoring" | "balanced" | "challenge"
}

export interface ParentCommunication {
  subject: string
  content: string
  tone: "positive" | "concern" | "neutral"
  urgency: "low" | "medium" | "high"
  talkingPoints: string[]
}

export interface LearningInsight {
  type: "trajectory" | "engagement" | "behavior" | "social"
  title: string
  description: string
  actionItems: string[]
  confidence: number
}

class AITeachingAssistant {
  private isAPIKeyAvailable = false

  constructor() {
    // More thorough API key detection
    this.checkAPIKeyAvailability()
  }

  private checkAPIKeyAvailability() {
    try {
      // Check various possible locations for the API key
      const hasEnvKey = !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY)

      // Additional check for client-side
      const hasClientKey = typeof window !== "undefined" && !!(window as any).GOOGLE_GENERATIVE_AI_API_KEY

      this.isAPIKeyAvailable = hasEnvKey || hasClientKey

      // Extra validation - check if key looks valid
      if (this.isAPIKeyAvailable) {
        const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY
        if (key && key.length < 20) {
          console.warn("Google Gemini API key format appears invalid")
          this.isAPIKeyAvailable = false
        }
      }

      console.log("AI Service initialized:", this.isAPIKeyAvailable ? "Full AI Mode" : "Demo Mode")
    } catch (error) {
      console.warn("Error checking API key availability:", error)
      this.isAPIKeyAvailable = false
    }
  }

  private async callAI(prompt: string, systemPrompt: string): Promise<string> {
    if (!this.isAPIKeyAvailable) {
      throw new Error("Google Gemini API key not configured")
    }

    try {
      const model = google("gemini-2.0-flash-exp")
      const { text } = await generateText({
        model,
        prompt,
        system: systemPrompt,
        maxTokens: 4000,
        temperature: 0.7,
      })
      return text
    } catch (error: any) {
      console.error("AI API Error:", error)
      
      // Handle specific error types for better user experience
      if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
        throw new Error("AI service is temporarily at capacity. Please try again in a few minutes.")
      }
      
      if (error?.message?.includes('API key')) {
        throw new Error("AI service configuration error. Please check your API key.")
      }
      
      // Don't expose internal API errors to users
      throw new Error("AI service temporarily unavailable. Please try again.")
    }
  }

  async predictGrades(students: Student[], assignmentContext?: string): Promise<GradePrediction[]> {
    const predictions: GradePrediction[] = []

    console.log(
      `Generating predictions for ${students.length} students in ${this.isAPIKeyAvailable ? "AI" : "Demo"} mode`,
    )

    for (const student of students) {
      try {
        let prediction: GradePrediction

        if (this.isAPIKeyAvailable) {
          // Use AI prediction
          prediction = await this.generateAIPrediction(student, assignmentContext)
        } else {
          // Use rule-based prediction
          prediction = this.generateRuleBasedPrediction(student)
        }

        predictions.push(prediction)
      } catch (error) {
        console.error(`Error predicting grade for ${student.name}:`, error)
        // Always fall back to rule-based prediction
        const fallbackPrediction = this.generateRuleBasedPrediction(student)
        predictions.push(fallbackPrediction)
      }
    }

    return predictions
  }

  private async generateAIPrediction(student: Student, assignmentContext?: string): Promise<GradePrediction> {
    const prompt = `
    Analyze this student's academic profile and predict their performance on the next assignment:
    
    Student: ${student.name}
    Current Grade: ${student.grade || "No grade yet"}
    Notes: ${student.notes}
    Tags: ${student.tags.join(", ")}
    Assignment Context: ${assignmentContext || "General assignment"}
    
    Based on this information, provide:
    1. Predicted grade (0-100)
    2. Risk level (low/medium/high)
    3. Specific intervention strategies
    4. Reasoning for the prediction
    
    Format as JSON with keys: predictedGrade, riskLevel, interventions (array), reasoning
    `

    const text = await this.callAI(
      prompt,
      "You are an expert educational AI that analyzes student data to provide accurate predictions and helpful interventions. Always be constructive and focus on student success.",
    )

    const analysis = JSON.parse(text)

    return {
      studentId: student.id,
      predictedGrade: analysis.predictedGrade,
      confidence: this.calculateConfidence(student),
      riskLevel: analysis.riskLevel,
      interventions: analysis.interventions,
      reasoning: analysis.reasoning,
    }
  }

  private generateRuleBasedPrediction(student: Student): GradePrediction {
    const currentGrade = student.grade || 75
    let predictedGrade = currentGrade
    let riskLevel: "low" | "medium" | "high" = "low"
    let interventions: string[] = []
    let reasoning = ""

    // Analyze tags for risk factors
    const riskTags = ["needs-support", "absent", "makeup-needed"]
    const positiveTags = ["honor-roll", "active", "leader", "improving"]

    const hasRiskFactors = student.tags.some((tag) => riskTags.includes(tag))
    const hasPositiveFactors = student.tags.some((tag) => positiveTags.includes(tag))

    if (hasRiskFactors) {
      predictedGrade = Math.max(currentGrade - 10, 50)
      riskLevel = "high"
      interventions = [
        "Provide additional one-on-one support",
        "Check in daily for understanding",
        "Break assignments into smaller chunks",
        "Connect with family for home support",
      ]
      reasoning =
        "Student shows risk factors in their profile that may impact performance. Early intervention recommended to prevent grade decline."
    } else if (hasPositiveFactors) {
      predictedGrade = Math.min(currentGrade + 5, 100)
      riskLevel = "low"
      interventions = ["Consider advanced challenges", "Peer tutoring opportunities", "Leadership roles in group work"]
      reasoning =
        "Student demonstrates strong positive indicators and engagement. Consider enrichment opportunities to maintain growth trajectory."
    } else {
      predictedGrade = currentGrade
      riskLevel = "medium"
      interventions = ["Monitor progress regularly", "Provide consistent feedback", "Encourage active participation"]
      reasoning =
        "Student performance appears stable based on current data. Continue current support strategies with regular monitoring."
    }

    // Adjust based on current grade
    if (currentGrade < 70) {
      riskLevel = "high"
      interventions.unshift("Immediate academic intervention needed")
      reasoning += " Low current grade indicates need for immediate support."
    } else if (currentGrade > 90) {
      riskLevel = "low"
      reasoning += " High performance suggests strong academic foundation."
    }

    return {
      studentId: student.id,
      predictedGrade: Math.round(predictedGrade),
      confidence: this.calculateConfidence(student),
      riskLevel,
      interventions,
      reasoning,
    }
  }

  async suggestOptimalGroups(students: Student[], purpose = "collaborative"): Promise<GroupSuggestion[]> {
    try {
      if (this.isAPIKeyAvailable) {
        return await this.generateAIGroups(students, purpose)
      } else {
        return this.generateRuleBasedGroups(students, purpose)
      }
    } catch (error) {
      console.error("Error generating group suggestions:", error)
      return this.generateRuleBasedGroups(students, purpose)
    }
  }

  private async generateAIGroups(students: Student[], purpose: string): Promise<GroupSuggestion[]> {
    const studentProfiles = students.map((s) => ({
      id: s.id,
      name: s.name,
      grade: s.grade,
      tags: s.tags,
      notes: s.notes,
    }))

    const prompt = `
    Create optimal student groups for ${purpose} work:
    
    Students: ${JSON.stringify(studentProfiles, null, 2)}
    
    Consider:
    - Academic performance balance
    - Learning styles and personalities (inferred from tags/notes)
    - Social dynamics
    - Peer tutoring opportunities
    
    Create 3-4 groups of 3-5 students each. For each group, provide:
    1. Student IDs
    2. Reasoning for the composition
    3. Effectiveness score (0-1)
    4. Specific benefits of this grouping
    
    Format as JSON array with keys: students (array of IDs), reasoning, effectiveness, benefits
    `

    const text = await this.callAI(
      prompt,
      "You are an expert in educational psychology and group dynamics. Create balanced, effective student groups that promote learning and positive social interaction.",
    )

    const suggestions = JSON.parse(text)

    return suggestions.map((suggestion: any, index: number) => ({
      groupId: `ai-group-${index + 1}`,
      students: students.filter((s) => suggestion.students.includes(s.id)),
      reasoning: suggestion.reasoning,
      effectiveness: suggestion.effectiveness,
      purpose: purpose as any,
    }))
  }

  private generateRuleBasedGroups(students: Student[], purpose: string): GroupSuggestion[] {
    const groups: GroupSuggestion[] = []

    // Sort students by grade for better distribution
    const sortedStudents = [...students].sort((a, b) => (b.grade || 0) - (a.grade || 0))
    const groupSize = Math.ceil(students.length / 4) // Aim for 4 groups

    for (let i = 0; i < 4 && i * groupSize < students.length; i++) {
      const startIndex = i * groupSize
      const endIndex = Math.min(startIndex + groupSize, students.length)

      // Create mixed-ability groups by taking students from different performance levels
      const groupStudents: Student[] = []
      for (let j = 0; j < groupSize && startIndex + j < students.length; j++) {
        const studentIndex = (startIndex + j) % students.length
        if (studentIndex < students.length) {
          groupStudents.push(sortedStudents[studentIndex])
        }
      }

      if (groupStudents.length > 0) {
        const avgGrade = groupStudents.reduce((sum, s) => sum + (s.grade || 75), 0) / groupStudents.length
        const hasLeader = groupStudents.some((s) => s.tags.includes("leader"))
        const hasSupport = groupStudents.some((s) => s.tags.includes("needs-support"))

        let effectiveness = 0.75 // Base effectiveness
        if (hasLeader && hasSupport) effectiveness = 0.85 // Good mix
        if (avgGrade > 85) effectiveness = 0.8 // High performers

        groups.push({
          groupId: `rule-group-${i + 1}`,
          students: groupStudents,
          reasoning: `Balanced group created with mixed academic performance levels (avg: ${Math.round(avgGrade)}%). ${hasLeader ? "Includes natural leader for peer support. " : ""}${hasSupport ? "Includes students who may benefit from collaborative learning." : "Students demonstrate strong independent work capabilities."}`,
          effectiveness,
          purpose: purpose as any,
        })
      }
    }

    return groups
  }

  async generateParentCommunication(student: Student, context: string): Promise<ParentCommunication> {
    try {
      if (this.isAPIKeyAvailable) {
        return await this.generateAICommunication(student, context)
      } else {
        return this.generateTemplateCommunication(student, context)
      }
    } catch (error) {
      console.error("Error generating parent communication:", error)
      return this.generateTemplateCommunication(student, context)
    }
  }

  private async generateAICommunication(student: Student, context: string): Promise<ParentCommunication> {
    const prompt = `
    Generate a personalized communication for ${student.name}'s parent/guardian:
    
    Student Profile:
    - Name: ${student.name}
    - Current Grade: ${student.grade || "No grade yet"}
    - Notes: ${student.notes}
    - Tags: ${student.tags.join(", ")}
    
    Context: ${context}
    
    Create a professional, warm communication that includes:
    1. Appropriate subject line
    2. Email content (2-3 paragraphs)
    3. Tone assessment
    4. Urgency level
    5. Key talking points for follow-up
    
    Format as JSON with keys: subject, content, tone, urgency, talkingPoints (array)
    `

    const text = await this.callAI(
      prompt,
      "You are an experienced teacher who writes thoughtful, professional communications to parents. Be positive, specific, and actionable in your messaging.",
    )

    return JSON.parse(text)
  }

  private generateTemplateCommunication(student: Student, context: string): ParentCommunication {
    const hasPositiveTags = student.tags.some((tag) => ["honor-roll", "active", "leader", "improving"].includes(tag))
    const hasConcerns = student.tags.some((tag) => ["needs-support", "absent", "makeup-needed"].includes(tag))

    let tone: "positive" | "concern" | "neutral" = "neutral"
    let urgency: "low" | "medium" | "high" = "low"

    if (hasConcerns) {
      tone = "concern"
      urgency = "medium"
    } else if (hasPositiveTags) {
      tone = "positive"
    }

    const subject = `Update on ${student.name}'s Progress`
    const content = `Dear Parent/Guardian,

I wanted to reach out regarding ${student.name}'s recent progress in class. ${
      hasPositiveTags
        ? `${student.name} has been doing excellent work and showing great engagement in class.`
        : hasConcerns
          ? `I've noticed some areas where ${student.name} could benefit from additional support.`
          : `${student.name} is making steady progress in their learning.`
    }

${student.notes ? `Additional notes: ${student.notes}` : ""}

I'd be happy to discuss ${student.name}'s progress in more detail. Please feel free to reach out if you have any questions or would like to schedule a conference.

Best regards,
[Your Name]`

    return {
      subject,
      content,
      tone,
      urgency,
      talkingPoints: [
        "Discuss recent academic progress",
        "Review classroom behavior and engagement",
        "Plan strategies for continued success",
        "Address any concerns or questions",
      ],
    }
  }

  async analyzeLearningTrajectory(student: Student, historicalData?: any[]): Promise<LearningInsight[]> {
    try {
      if (this.isAPIKeyAvailable) {
        return await this.generateAIInsights(student, historicalData)
      } else {
        return this.generateRuleBasedInsights(student)
      }
    } catch (error) {
      console.error("Error analyzing learning trajectory:", error)
      return this.generateRuleBasedInsights(student)
    }
  }

  private async generateAIInsights(student: Student, historicalData?: any[]): Promise<LearningInsight[]> {
    const prompt = `
    Analyze the learning trajectory for ${student.name}:
    
    Current Status:
    - Grade: ${student.grade || "No grade yet"}
    - Notes: ${student.notes}
    - Tags: ${student.tags.join(", ")}
    
    Historical Data: ${JSON.stringify(historicalData || [], null, 2)}
    
    Provide insights about:
    1. Learning velocity and patterns
    2. Engagement trends
    3. Behavioral observations
    4. Social development
    
    For each insight, include:
    - Type (trajectory/engagement/behavior/social)
    - Title (brief summary)
    - Description (detailed analysis)
    - Action items (specific recommendations)
    - Confidence level (0-1)
    
    Format as JSON array with these keys.
    `

    const text = await this.callAI(
      prompt,
      "You are an educational data analyst who provides actionable insights about student learning patterns and development.",
    )

    return JSON.parse(text)
  }

  private generateRuleBasedInsights(student: Student): LearningInsight[] {
    const insights: LearningInsight[] = []

    // Trajectory insight
    if (student.grade !== null) {
      insights.push({
        type: "trajectory",
        title: `Academic Performance Analysis`,
        description: `${student.name} currently has a ${student.grade}% average. ${
          student.grade >= 90
            ? "Excellent performance with consistent high achievement."
            : student.grade >= 80
              ? "Good performance with room for growth."
              : student.grade >= 70
                ? "Satisfactory performance, may benefit from additional support."
                : "Performance indicates need for immediate intervention and support."
        }`,
        actionItems:
          student.grade >= 80
            ? ["Continue current strategies", "Consider enrichment opportunities"]
            : ["Provide additional support", "Monitor progress closely", "Consider tutoring"],
        confidence: 0.8,
      })
    }

    // Engagement insight
    if (student.tags.includes("active")) {
      insights.push({
        type: "engagement",
        title: "High Engagement Level",
        description: `${student.name} shows strong classroom engagement and participation.`,
        actionItems: ["Leverage engagement for peer leadership", "Provide challenging tasks"],
        confidence: 0.9,
      })
    } else if (student.tags.includes("quiet")) {
      insights.push({
        type: "engagement",
        title: "Quiet Participation Style",
        description: `${student.name} may benefit from alternative ways to demonstrate engagement.`,
        actionItems: ["Offer written reflection opportunities", "Use small group discussions"],
        confidence: 0.7,
      })
    }

    // Behavioral insight
    if (student.tags.includes("improving")) {
      insights.push({
        type: "behavior",
        title: "Positive Growth Trajectory",
        description: `${student.name} is showing improvement in their academic performance and behavior.`,
        actionItems: ["Celebrate progress", "Maintain current support strategies", "Set new goals"],
        confidence: 0.85,
      })
    }

    return insights
  }

  async generateInterventionStrategies(student: Student, riskFactors: string[]): Promise<string[]> {
    try {
      if (this.isAPIKeyAvailable) {
        return await this.generateAIInterventions(student, riskFactors)
      } else {
        return this.generateTemplateInterventions(student, riskFactors)
      }
    } catch (error) {
      console.error("Error generating intervention strategies:", error)
      return this.generateTemplateInterventions(student, riskFactors)
    }
  }

  private async generateAIInterventions(student: Student, riskFactors: string[]): Promise<string[]> {
    const prompt = `
    Create specific intervention strategies for ${student.name}:
    
    Student Profile:
    - Grade: ${student.grade || "No grade yet"}
    - Notes: ${student.notes}
    - Tags: ${student.tags.join(", ")}
    
    Risk Factors: ${riskFactors.join(", ")}
    
    Provide 5-7 specific, actionable intervention strategies that are:
    - Personalized to this student
    - Practical for classroom implementation
    - Evidence-based
    - Positive and supportive
    
    Return as a JSON array of strings.
    `

    const text = await this.callAI(
      prompt,
      "You are an expert in educational interventions and student support strategies. Focus on positive, research-based approaches.",
    )

    return JSON.parse(text)
  }

  private generateTemplateInterventions(student: Student, riskFactors: string[]): string[] {
    const interventions = [
      "Provide additional one-on-one support during class",
      "Break down complex tasks into smaller, manageable steps",
      "Use visual aids and hands-on activities to support learning",
      "Implement regular check-ins to monitor understanding",
      "Connect with family to coordinate home support strategies",
    ]

    // Add specific interventions based on tags
    if (student.tags.includes("needs-support")) {
      interventions.push("Consider peer tutoring or study buddy system")
    }
    if (student.tags.includes("absent")) {
      interventions.push("Develop attendance improvement plan with family")
    }
    if (student.tags.includes("quiet")) {
      interventions.push("Provide alternative ways to demonstrate understanding")
    }

    return interventions.slice(0, 7) // Limit to 7 interventions
  }

  private calculateConfidence(student: Student): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence based on available data
    if (student.grade !== null) confidence += 0.2
    if (student.notes && student.notes.length > 10) confidence += 0.1
    if (student.tags && student.tags.length > 0) confidence += 0.1

    // Reduce confidence if API key is not available
    if (!this.isAPIKeyAvailable) confidence *= 0.8

    // Cap at 0.9 to acknowledge uncertainty
    return Math.min(confidence, 0.9)
  }

  getAPIStatus(): { available: boolean; message: string } {
    if (this.isAPIKeyAvailable) {
      return {
        available: true,
        message: "AI features fully available with Google Gemini integration",
      }
    } else {
      return {
        available: false,
        message: "AI features running in demo mode. Add GOOGLE_GENERATIVE_AI_API_KEY for full functionality.",
      }
    }
  }
}

export const aiTeachingAssistant = new AITeachingAssistant()
