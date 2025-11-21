'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PieChart, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = {
  PERSONA: 1,
  CURRENCY: 2,
  INCOME: 3,
  COMPLETE: 4,
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(STEPS.PERSONA)
  const [isLoading, setIsLoading] = useState(false)

  // Form data
  const [persona, setPersona] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [country, setCountry] = useState('')
  const [incomeName, setIncomeName] = useState('Monthly Salary')
  const [incomeAmount, setIncomeAmount] = useState('')

  const handleNext = () => {
    if (currentStep < STEPS.COMPLETE) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > STEPS.PERSONA) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Create profile
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency,
          country,
          persona,
          onboardingCompleted: true,
        }),
      })

      // Create income if provided
      if (incomeAmount) {
        await fetch('/api/income', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: incomeName,
            amount: parseFloat(incomeAmount),
            frequency: 'MONTHLY',
          }),
        })
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case STEPS.PERSONA:
        return persona !== ''
      case STEPS.CURRENCY:
        return currency !== '' && country !== ''
      case STEPS.INCOME:
        return true // Income is optional
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <PieChart className="h-10 w-10 text-blue-500 mr-2" />
          <span className="text-3xl font-bold text-white">MoneyMap</span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 mx-1 rounded-full ${
                  step <= currentStep ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm">
            Step {currentStep} of {STEPS.COMPLETE}
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {currentStep === STEPS.PERSONA && "Tell us about yourself"}
              {currentStep === STEPS.CURRENCY && "Your location"}
              {currentStep === STEPS.INCOME && "Your income (optional)"}
              {currentStep === STEPS.COMPLETE && "All set!"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {currentStep === STEPS.PERSONA && "This helps us personalize your experience"}
              {currentStep === STEPS.CURRENCY && "We'll use this for currency formatting"}
              {currentStep === STEPS.INCOME && "Add your main income source to get started"}
              {currentStep === STEPS.COMPLETE && "You're ready to start managing your money"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Persona */}
            {currentStep === STEPS.PERSONA && (
              <div className="space-y-4">
                <Label className="text-white">I am a...</Label>
                <div className="grid grid-cols-2 gap-4">
                  {['Student', 'Working Full-time', 'Working Part-time', 'Other'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setPersona(option)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        persona === option
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Currency & Country */}
            {currentStep === STEPS.CURRENCY && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-white">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CHF">CHF (Fr)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-white">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="ES">Spain</SelectItem>
                      <SelectItem value="IT">Italy</SelectItem>
                      <SelectItem value="CH">Switzerland</SelectItem>
                      <SelectItem value="NL">Netherlands</SelectItem>
                      <SelectItem value="BE">Belgium</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Income */}
            {currentStep === STEPS.INCOME && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="incomeName" className="text-white">Income Source</Label>
                  <Input
                    id="incomeName"
                    type="text"
                    placeholder="e.g., Monthly Salary, Allowance"
                    value={incomeName}
                    onChange={(e) => setIncomeName(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incomeAmount" className="text-white">
                    Monthly Amount ({currency})
                  </Label>
                  <Input
                    id="incomeAmount"
                    type="number"
                    placeholder="0.00"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <p className="text-sm text-slate-400">
                  You can skip this and add it later in your dashboard
                </p>
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === STEPS.COMPLETE && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  You're all set!
                </h3>
                <p className="text-slate-400">
                  Let's start tracking your money and reaching your goals
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {currentStep > STEPS.PERSONA && currentStep < STEPS.COMPLETE && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}

              {currentStep < STEPS.COMPLETE && (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="ml-auto"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              {currentStep === STEPS.COMPLETE && (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Setting up...' : 'Go to Dashboard'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
