"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Database, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SetupBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkDatabaseSetup()
  }, [])

  const checkDatabaseSetup = async () => {
    try {
      // Try to query one of the AI tables to see if setup is complete
      const { error } = await supabase.from("mood_checkins").select("id").limit(1)

      if (error && error.message.includes("does not exist")) {
        setShowBanner(true)
      }
    } catch (error) {
      console.log("Database setup check:", error)
      setShowBanner(true)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking || !showBanner) {
    return null
  }

  return (
    <Alert className="mx-6 mt-4 border-blue-200 bg-blue-50">
      <Database className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong className="text-blue-900">Database Setup Required:</strong>
          <span className="text-blue-800 ml-2">
            AI features need additional database tables. Click here to set them up.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/setup">
            <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Setup Database
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowBanner(false)}
            className="text-blue-600 hover:bg-blue-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
