'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

export default function UpgradeButtonClient() {
  const [isFreePlan, setIsFreePlan] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setIsFreePlan(data.plan === 'FREE' || !data.plan)
        }
      } catch (error) {
        console.error('Error fetching plan:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlan()
  }, [])

  if (isLoading || !isFreePlan) {
    return null
  }

  return (
    <Link href="/settings/billing">
      <Button 
        className="fixed bottom-6 right-6 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-6 text-base z-50"
        size="lg"
      >
        <Zap className="mr-2 h-5 w-5" />
        Upgrade to Pro
        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-xs">
          €2.99/mo
        </span>
      </Button>
    </Link>
  )
}
