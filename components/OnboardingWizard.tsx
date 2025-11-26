'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, CreditCard, Target, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { toast } from 'sonner'

interface OnboardingWizardProps {
  onComplete: () => void
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Income
  const [incomeName, setIncomeName] = useState('')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeFrequency, setIncomeFrequency] = useState('MONTHLY')

  // Step 2: Expense
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseFrequency, setExpenseFrequency] = useState('MONTHLY')
  const [expenseCategory, setExpenseCategory] = useState('HOUSING')

  // Step 3: Goal
  const [goalName, setGoalName] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')

  const totalSteps = 4

  const handleNext = async () => {
    if (step === 1 && incomeName && incomeAmount) {
      setLoading(true)
      try {
        const res = await fetch('/api/income', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: incomeName,
            amount: parseFloat(incomeAmount),
            frequency: incomeFrequency,
          }),
        })
        if (res.ok) {
          setStep(2)
          toast.success('Income added!')
        } else {
          toast.error('Failed to add income')
        }
      } catch (error) {
        toast.error('An error occurred')
      } finally {
        setLoading(false)
      }
    } else if (step === 2 && expenseName && expenseAmount) {
      setLoading(true)
      try {
        const res = await fetch('/api/fixed-costs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: expenseName,
            amount: parseFloat(expenseAmount),
            frequency: expenseFrequency,
            category: expenseCategory,
          }),
        })
        if (res.ok) {
          setStep(3)
          toast.success('Expense added!')
        } else {
          toast.error('Failed to add expense')
        }
      } catch (error) {
        toast.error('An error occurred')
      } finally {
        setLoading(false)
      }
    } else if (step === 3 && goalName && goalAmount) {
      setLoading(true)
      try {
        const res = await fetch('/api/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: goalName,
            targetAmount: parseFloat(goalAmount),
            currentAmount: 0,
            deadline: goalDeadline || null,
          }),
        })
        if (res.ok) {
          setStep(4)
          toast.success('Goal created!')
        } else {
          toast.error('Failed to create goal')
        }
      } catch (error) {
        toast.error('An error occurred')
      } finally {
        setLoading(false)
      }
    } else if (step === 4) {
      await completeOnboarding()
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const handleSkip = async () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      await completeOnboarding()
    }
  }

  const handleLoadSampleData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/sample-data', {
        method: 'POST',
      })
      if (res.ok) {
        toast.success('Sample data loaded!')
        await completeOnboarding()
      } else {
        toast.error('Failed to load sample data')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingCompleted: true }),
      })
      if (res.ok) {
        toast.success('Welcome to MoneyMap! 🎉')
        onComplete()
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-gray-900 dark:text-white">Welcome to MoneyMap!</CardTitle>
            </div>
            <span className="text-sm text-gray-600 dark:text-slate-400">
              Step {step} of {totalSteps}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Add Income */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Your Income</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Let's start with your main source of income
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income-name" className="text-gray-700 dark:text-slate-300">
                  Income Source *
                </Label>
                <Input
                  id="income-name"
                  placeholder="e.g., Salary, Freelance"
                  value={incomeName}
                  onChange={(e) => setIncomeName(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income-amount" className="text-gray-700 dark:text-slate-300">
                    Amount *
                  </Label>
                  <Input
                    id="income-amount"
                    type="number"
                    placeholder="2500"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income-frequency" className="text-gray-700 dark:text-slate-300">
                    Frequency
                  </Label>
                  <Select value={incomeFrequency} onValueChange={setIncomeFrequency}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add Expense */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <CreditCard className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add an Expense</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Add your first recurring expense
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-name" className="text-gray-700 dark:text-slate-300">
                  Expense Name *
                </Label>
                <Input
                  id="expense-name"
                  placeholder="e.g., Rent, Groceries"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-amount" className="text-gray-700 dark:text-slate-300">
                    Amount *
                  </Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    placeholder="800"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-frequency" className="text-gray-700 dark:text-slate-300">
                    Frequency
                  </Label>
                  <Select value={expenseFrequency} onValueChange={setExpenseFrequency}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-category" className="text-gray-700 dark:text-slate-300">
                  Category
                </Label>
                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOUSING">Housing</SelectItem>
                    <SelectItem value="FOOD">Food</SelectItem>
                    <SelectItem value="TRANSPORT">Transport</SelectItem>
                    <SelectItem value="UTILITIES">Utilities</SelectItem>
                    <SelectItem value="INSURANCE">Insurance</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Set Goal */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Set Your First Goal</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    What are you saving for?
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-name" className="text-gray-700 dark:text-slate-300">
                  Goal Name *
                </Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Emergency Fund, Vacation"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-amount" className="text-gray-700 dark:text-slate-300">
                    Target Amount *
                  </Label>
                  <Input
                    id="goal-amount"
                    type="number"
                    placeholder="5000"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline" className="text-gray-700 dark:text-slate-300">
                    Deadline (Optional)
                  </Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div className="space-y-6 text-center py-8">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  You're All Set! 🎉
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  Your MoneyMap is ready. Start tracking your finances and reaching your goals!
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-slate-300">
                  💡 <strong>Tip:</strong> You can add more income sources, expenses, and goals anytime from your dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-800">
            <div>
              {step < 4 && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={loading}
                  className="text-gray-600 dark:text-slate-400"
                >
                  Skip this step
                </Button>
              )}
              {step === 1 && (
                <Button
                  variant="outline"
                  onClick={handleLoadSampleData}
                  disabled={loading}
                  className="ml-2"
                >
                  Load Sample Data
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {step > 1 && step < 4 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button onClick={handleNext} disabled={loading}>
                {loading ? (
                  'Loading...'
                ) : step === 4 ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
