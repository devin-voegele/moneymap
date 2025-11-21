'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PieChart, LogOut, Settings, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/budget', label: 'Budget' },
    { href: '/subscriptions', label: 'Subscriptions' },
    { href: '/goals', label: 'Goals' },
    { href: '/coach', label: 'Coach' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <PieChart className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">MoneyMap</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition ${
                  isActive(item.href)
                    ? 'text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/settings/profile">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/api/auth/signout">
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Navigation - Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed inset-0 top-[73px] bg-slate-950 z-50 overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-8 space-y-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-4 px-6 rounded-lg text-lg transition ${
                      isActive(item.href)
                        ? 'bg-blue-500/20 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="/settings/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center py-4 px-6 text-lg text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    href="/api/auth/signout"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center py-4 px-6 text-lg text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
