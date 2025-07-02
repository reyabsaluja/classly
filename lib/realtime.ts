"use client"

import { useEffect } from "react"
import { supabase } from "./supabase"
import { useStudentStore } from "./store"

export function useRealtimeSubscriptions() {
  const { fetchStudents, fetchGroups } = useStudentStore()

  useEffect(() => {
    // Subscribe to students table changes
    const studentsSubscription = supabase
      .channel("students-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "students",
        },
        () => {
          // Refetch students when any change occurs
          fetchStudents()
        },
      )
      .subscribe()

    // Subscribe to groups table changes
    const groupsSubscription = supabase
      .channel("groups-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "groups",
        },
        () => {
          // Refetch groups when any change occurs
          fetchGroups()
        },
      )
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(studentsSubscription)
      supabase.removeChannel(groupsSubscription)
    }
  }, [fetchStudents, fetchGroups])
}
