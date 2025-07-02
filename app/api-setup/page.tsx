import APIKeySetup from "@/components/api-key-setup"

export default function APISetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Configuration</h1>
          <p className="text-gray-600">Set up your Google Gemini API key to unlock full AI capabilities</p>
        </div>
        <APIKeySetup />
      </div>
    </div>
  )
}
