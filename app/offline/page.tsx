'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-slate-800 rounded-full">
            <WifiOff className="h-12 w-12 text-slate-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">You're Offline</h1>
        <p className="text-slate-400 mb-6">
          It looks like you've lost your internet connection. Some features may not be available until you're back online.
        </p>
        
        <Button 
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
