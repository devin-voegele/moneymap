'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Zap, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

type UpgradeModalProps = {
  isOpen: boolean
  onClose: () => void
  feature: string
  message: string
}

export default function UpgradeModal({ isOpen, onClose, feature, message }: UpgradeModalProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/settings/billing')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-blue-500/50 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <DialogTitle className="text-white text-xl">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription className="text-slate-300 text-base">
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm font-medium mb-3">
              💡 {feature === 'subscription' && 'Most Pro users discover at least one subscription to cancel.'}
              {feature === 'goal' && 'Track multiple goals and reach them faster with Pro insights.'}
              {feature === 'income' && 'Track all your income sources in one place.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm">With Pro you get:</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-slate-300 text-sm">
                <Check className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                <span>Unlimited {feature}s</span>
              </li>
              <li className="flex items-center text-slate-300 text-sm">
                <Check className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                <span>Unlimited AI coach questions</span>
              </li>
              <li className="flex items-center text-slate-300 text-sm">
                <Check className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                <span>What-if simulator</span>
              </li>
              <li className="flex items-center text-slate-300 text-sm">
                <Check className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                <span>Smart suggestions</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-white">€4.99</span>
              <span className="text-slate-400">/month</span>
              <span className="text-sm text-slate-500">or €39/year</span>
            </div>
            <Button onClick={handleUpgrade} className="w-full" size="lg">
              <Zap className="mr-2 h-5 w-5" />
              Upgrade to Pro
            </Button>
            <p className="text-center text-xs text-slate-500 mt-2">
              Cancel anytime • Secure payment by Stripe
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
