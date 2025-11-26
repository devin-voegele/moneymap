'use client'

import { useState } from 'react'
import OnboardingWizard from './OnboardingWizard'

interface DashboardClientProps {
  needsOnboarding: boolean
  children: React.ReactNode
}

export default function DashboardClient({ needsOnboarding, children }: DashboardClientProps) {
  const [showOnboarding, setShowOnboarding] = useState(needsOnboarding)

  if (showOnboarding) {
    return <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
  }

  return <>{children}</>
}
