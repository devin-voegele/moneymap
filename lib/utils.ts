import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Convert different frequencies to monthly amount
export function convertToMonthly(amount: number, frequency: string): number {
  switch (frequency) {
    case 'WEEKLY':
      return amount * 4.33 // Average weeks per month
    case 'YEARLY':
      return amount / 12
    case 'MONTHLY':
    default:
      return amount
  }
}

// Calculate goal progress percentage
export function getGoalProgress(currentSaved: number, targetAmount: number): number {
  if (targetAmount === 0) return 0
  return Math.min(Math.round((currentSaved / targetAmount) * 100), 100)
}

// Calculate required monthly savings for a goal
export function calculateRequiredMonthlySavings(
  currentSaved: number,
  targetAmount: number,
  targetDate: Date | string | null
): number {
  if (!targetDate) return 0
  
  const deadline = targetDate instanceof Date ? targetDate : new Date(targetDate)
  const now = new Date()
  const monthsLeft = Math.max(
    (deadline.getFullYear() - now.getFullYear()) * 12 +
    (deadline.getMonth() - now.getMonth()),
    1
  )
  return Math.max((targetAmount - currentSaved) / monthsLeft, 0)
}

export function getGoalStatus(
  currentSaved: number,
  targetAmount: number,
  targetDate: string | Date | null
): 'completed' | 'on-track' | 'at-risk' | 'off-track' {
  // Check if goal is completed
  if (currentSaved >= targetAmount) return 'completed'
  
  // If no deadline, can't determine status
  if (!targetDate) return 'on-track'
  
  const deadline = targetDate instanceof Date ? targetDate : new Date(targetDate)
  const now = new Date()
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  // If deadline passed
  if (daysLeft < 0) return 'off-track'
  
  // Calculate progress rate
  const progressPercentage = (currentSaved / targetAmount) * 100
  const timeElapsedPercentage = 100 - Math.min(100, (daysLeft / 365) * 100)
  
  // If progress is significantly behind time elapsed
  if (progressPercentage < timeElapsedPercentage - 20) return 'at-risk'
  if (progressPercentage < timeElapsedPercentage - 10) return 'at-risk'
  
  return 'on-track'
}
