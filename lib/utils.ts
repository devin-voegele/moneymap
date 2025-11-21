import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function convertToMonthly(amount: number, frequency: string): number {
  switch (frequency) {
    case 'WEEKLY':
      return amount * 52 / 12
    case 'YEARLY':
      return amount / 12
    case 'MONTHLY':
    default:
      return amount
  }
}

export function getGoalProgress(currentSaved: number, targetAmount: number): number {
  if (targetAmount === 0) return 0
  return Math.min(Math.round((currentSaved / targetAmount) * 100), 100)
}

export function calculateRequiredMonthlySaving(
  targetAmount: number,
  currentSaved: number,
  targetDate: Date
): number {
  const now = new Date()
  const monthsLeft = Math.max(
    (targetDate.getFullYear() - now.getFullYear()) * 12 +
    (targetDate.getMonth() - now.getMonth()),
    1
  )
  return Math.max((targetAmount - currentSaved) / monthsLeft, 0)
}

export function getGoalStatus(
  currentSaved: number,
  targetAmount: number,
  targetDate: string | null
): 'completed' | 'on-track' | 'at-risk' | 'off-track' {
  // Check if goal is completed
  if (currentSaved >= targetAmount) return 'completed'
  
  // If no deadline, can't determine status
  if (!targetDate) return 'on-track'
  
  const deadline = new Date(targetDate)
  const now = new Date()
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  // If deadline passed
  if (daysLeft < 0) return 'off-track'
  
  // Calculate progress rate
  const progressPercentage = (currentSaved / targetAmount) * 100
  const timeElapsedPercentage = 100 - Math.min(100, (daysLeft / 365) * 100)
  
  // If progress is ahead of time
  if (progressPercentage >= timeElapsedPercentage) return 'on-track'
  
  // If progress is somewhat behind
  if (progressPercentage >= timeElapsedPercentage * 0.7) return 'at-risk'
  
  return 'off-track'
}
