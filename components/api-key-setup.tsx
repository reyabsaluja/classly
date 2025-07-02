"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react"

export default function APIKeySetup() {
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null)

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationResult({ valid: false, message: "Please enter an API key" })
      return
    }

    setIsValidating(true)
    try {
      // Simple validation - check if it has reasonable length
      const isValidFormat = apiKey.length > 20

      if (isValidFormat) {
        setValidationResult({
          valid: true,
          message: "API key format looks correct! Add it to your environment variables.",
        })
      } else {
        setValidationResult({ valid: false, message: "Invalid API key format. Please check your Google AI Studio key" })
      }
    } catch (error) {
      setValidationResult({ valid: false, message: "Error validating API key" })
    } finally {
      setIsValidating(false)
    }
  }

  const copyEnvExample = () => {
    const envText = `# Add this to your .env.local file
GOOGLE_GENERATIVE_AI_API_KEY=${apiKey || "your-gemini-api-key-here"}`
    navigator.clipboard.writeText(envText)
    alert("Environment variable example copied to clipboard!")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Google Gemini API Key Setup
          </CardTitle>
          <CardDescription>Configure your Google Gemini API key to unlock full AI-powered features in Classly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Google Gemini API Key</label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={validateApiKey} disabled={isValidating}>
                {isValidating ? "Validating..." : "Validate"}
              </Button>
            </div>
          </div>

          {validationResult && (
            <Alert variant={validationResult.valid ? "default" : "destructive"}>
              {validationResult.valid ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>{validationResult.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <h4 className="font-medium">Setup Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>
                Get your API key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Create a new API key</li>
              <li>Add it to your environment variables (see below)</li>
              <li>Restart your development server</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Environment Variable</h4>
              <Button variant="outline" size="sm" onClick={copyEnvExample}>
                Copy to Clipboard
              </Button>
            </div>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              <div className="text-gray-600"># Add this to your .env.local file</div>
              <div>GOOGLE_GENERATIVE_AI_API_KEY={apiKey || "your-gemini-api-key-here"}</div>
            </div>
          </div>

          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> Never commit your API key to version control. Use environment variables
              and add .env.local to your .gitignore file.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What You'll Get with Full AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✓ With Google Gemini API Key</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Intelligent grade predictions</li>
                <li>• Personalized intervention strategies</li>
                <li>• AI-optimized group suggestions</li>
                <li>• Custom parent communications</li>
                <li>• Deep learning insights</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-600">⚠ Demo Mode (Current)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Rule-based predictions</li>
                <li>• Template interventions</li>
                <li>• Basic group suggestions</li>
                <li>• Standard communications</li>
                <li>• Limited insights</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
