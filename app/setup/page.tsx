import DatabaseSetup from "@/components/database-setup"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Classly Setup</h1>
          <p className="text-gray-600">Configure your database for AI-powered features</p>
        </div>
        <DatabaseSetup />
      </div>
    </div>
  )
}
