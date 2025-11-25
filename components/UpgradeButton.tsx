import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

export default function UpgradeButton() {
  return (
    <Link href="/settings/billing">
      <Button 
        className="fixed bottom-6 right-6 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-6 text-base z-50 animate-pulse hover:animate-none"
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
