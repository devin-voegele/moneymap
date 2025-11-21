'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Plus, Trash2, Target, TrendingUp, Calendar, Edit } from 'lucide-react'
import { formatCurrency, getGoalProgress, getGoalStatus } from '@/lib/utils'
import Header from '@/components/Header'
import { toast } from 'sonner'

type Goal = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string | null
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [goalName, setGoalName] = useState('')
  const [goalTarget, setGoalTarget] = useState('')
  const [goalCurrent, setGoalCurrent] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')

  // Edit state
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals')
      if (res.ok) {
        const data = await res.json()
        setGoals(data)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddGoal = async () => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: goalName,
          targetAmount: parseFloat(goalTarget),
          currentAmount: goalCurrent ? parseFloat(goalCurrent) : 0,
          deadline: goalDeadline || null,
        })
      })

      if (res.ok) {
        await fetchGoals()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const handleUpdateGoal = async () => {
    if (!editingGoal) return

    try {
      const res = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingGoal.id,
          currentAmount: parseFloat(goalCurrent),
        })
      })

      if (res.ok) {
        await fetchGoals()
        setEditingGoal(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      const res = await fetch(`/api/goals?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchGoals()
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const resetForm = () => {
    setGoalName('')
    setGoalTarget('')
    setGoalCurrent('')
    setGoalDeadline('')
  }

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalCurrent(goal.currentAmount.toString())
  }

  const calculateRequiredMonthlySavings = (goal: Goal) => {
    if (!goal.deadline) return null
    
    const remaining = goal.targetAmount - goal.currentAmount
    const now = new Date()
    const deadline = new Date(goal.deadline)
    const monthsLeft = Math.max(1, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))
    
    return remaining / monthsLeft
  }

  const getTimeLeft = (deadline: string | null) => {
    if (!deadline) return null
    
    const now = new Date()
    const target = new Date(deadline)
    const diff = target.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Today'
    if (days === 1) return '1 day'
    if (days < 30) return `${days} days`
    if (days < 365) return `${Math.floor(days / 30)} months`
    return `${Math.floor(days / 365)} years`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Goals</h1>
            <p className="text-slate-400">Save for what actually matters</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create a New Goal</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Set a savings target and deadline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-name" className="text-white">Goal Name</Label>
                  <Input
                    id="goal-name"
                    placeholder="e.g., New PC, iPhone 15, Summer Holiday"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-target" className="text-white">Target Amount</Label>
                    <Input
                      id="goal-target"
                      type="number"
                      placeholder="0.00"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-current" className="text-white">Current Saved</Label>
                    <Input
                      id="goal-current"
                      type="number"
                      placeholder="0.00"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline" className="text-white">Target Date (Optional)</Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="py-12">
              <div className="text-center">
                <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No goals yet. Create your first savings goal!</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = getGoalProgress(goal.currentAmount, goal.targetAmount)
              const status = getGoalStatus(goal.currentAmount, goal.targetAmount, goal.deadline)
              const requiredMonthlySavings = calculateRequiredMonthlySavings(goal)
              const timeLeft = getTimeLeft(goal.deadline)

              return (
                <Card key={goal.id} className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-xl mb-1">{goal.name}</CardTitle>
                        <CardDescription className="text-slate-400">
                          {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(goal)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{progress}% complete</span>
                        <span className={`font-medium ${
                          status === 'completed' ? 'text-green-500' :
                          status === 'on-track' ? 'text-blue-500' :
                          status === 'at-risk' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {status === 'completed' ? '✓ Completed' :
                           status === 'on-track' ? 'On Track' :
                           status === 'at-risk' ? 'At Risk' :
                           'Off Track'}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      {goal.deadline && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Target Date
                          </span>
                          <span className="text-white">{new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      {timeLeft && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Time Left
                          </span>
                          <span className="text-white">{timeLeft}</span>
                        </div>
                      )}
                      {requiredMonthlySavings && requiredMonthlySavings > 0 && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Required/month</span>
                          <span className="text-white font-medium">
                            {formatCurrency(requiredMonthlySavings)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Remaining Amount */}
                    <div className="pt-3 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Remaining</span>
                        <span className="text-lg font-bold text-white">
                          {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Update Progress</DialogTitle>
              <DialogDescription className="text-slate-400">
                Update how much you've saved for {editingGoal?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-current" className="text-white">Current Saved Amount</Label>
                <Input
                  id="edit-current"
                  type="number"
                  placeholder="0.00"
                  value={goalCurrent}
                  onChange={(e) => setGoalCurrent(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-xs text-slate-400">
                  Target: {editingGoal && formatCurrency(editingGoal.targetAmount)}
                </p>
              </div>
              <Button onClick={handleUpdateGoal} className="w-full">
                Update Progress
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tips */}
        {goals.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <span className="font-semibold">Tip:</span> Set realistic deadlines and update your progress regularly to stay motivated!
                </p>
              </div>
              {goals.some(g => getGoalStatus(g.currentAmount, g.targetAmount, g.deadline) === 'at-risk') && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Some goals are at risk. Consider adjusting your monthly savings or extending the deadline.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
