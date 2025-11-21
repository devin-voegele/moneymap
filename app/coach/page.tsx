'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PieChart, LogOut, Settings, Send, Loader2, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedPrompts = [
    "Can I afford another subscription?",
    "How can I reach my goals faster?",
    "What should I cut first?",
    "Am I spending too much on subscriptions?",
    "How much should I save each month?",
  ]

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if (!res.ok) {
        throw new Error('Failed to get response')
      }

      if (res.ok) {
        const data = await res.json()
        
        // If AI took an action, show a special indicator
        if (data.actionTaken) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `✅ **Action completed!**\n\n${data.response}\n\n*Refresh the page to see your changes.*` 
          }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <PieChart className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">MoneyMap</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
              <Link href="/budget" className="text-slate-400 hover:text-white transition">Budget</Link>
              <Link href="/subscriptions" className="text-slate-400 hover:text-white transition">Subscriptions</Link>
              <Link href="/goals" className="text-slate-400 hover:text-white transition">Goals</Link>
              <Link href="/coach" className="text-white font-medium">Coach</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/settings/profile">
              <Button variant="ghost" size="sm">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-7xl">
        {/* Chat Container - Full Height */}
        <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Sparkles className="h-20 w-20 text-purple-500 mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-3">
                    AI Money Coach
                  </h3>
                  <p className="text-slate-400 mb-2 max-w-lg text-lg">
                    Ask me anything about your finances. I use your real numbers to give you clear, simple answers.
                  </p>
                  <p className="text-slate-500 mb-8 max-w-lg">
                    No investing hype. Just straight talk about your budget and goals.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-left text-slate-300 transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-5 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-100'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-5 w-5 text-purple-400" />
                            <span className="text-sm text-purple-400 font-medium">AI Coach</span>
                          </div>
                        )}
                        <div className="prose prose-invert prose-sm max-w-none">
                          {message.role === 'user' ? (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          ) : (
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="mb-3 space-y-1 list-disc list-inside">{children}</ul>,
                                ol: ({ children }) => <ol className="mb-3 space-y-1 list-decimal list-inside">{children}</ol>,
                                li: ({ children }) => <li className="text-slate-200">{children}</li>,
                                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                                em: ({ children }) => <em className="text-blue-300">{children}</em>,
                                code: ({ children }) => <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-300">{children}</code>,
                                h3: ({ children }) => <h3 className="text-lg font-semibold text-white mb-2">{children}</h3>,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 text-slate-100 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                          <span className="text-sm text-slate-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-700">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your finances..."
                  className="flex-1 bg-slate-800 border-slate-700 text-white text-base h-12"
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-12 px-6">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
      </main>
    </div>
  )
}
