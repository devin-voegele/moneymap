'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PieChart, LogOut, Settings, Send, Loader2, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import Header from '@/components/Header'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickPrompts = [
    "What can I do to save more money?",
    "Which subscriptions should I cancel?",
    "Export my budget to Excel",
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

      const data = await res.json()

      if (res.status === 403 && data.error === 'FREE_TIER_LIMIT') {
        // Show upgrade toast for free tier limit
        toast.error('Free tier limit reached', {
          description: data.message,
          action: {
            label: 'Upgrade to Pro',
            onClick: () => window.location.href = '/settings/billing'
          },
          duration: 5000
        })
        setMessages(prev => prev.slice(0, -1)) // Remove the user message
        return
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      // If AI took an action, show a special indicator
      if (data.actionTaken) {
        // Special handling for Excel export
        if (data.excelExport) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `${data.response}\n\n📊 **Generating your Excel report...**` 
          }])
          
          // Trigger download
          window.open('/api/export/excel', '_blank')
          
          toast.success('Excel report generated!', {
            description: 'Your report is downloading now.'
          })
        } else {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `✅ **Action completed!**\n\n${data.response}\n\n*Refresh the page to see your changes.*` 
          }])
          toast.success('Action completed!', {
            description: 'Your changes have been saved.'
          })
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error('Something went wrong', {
        description: error.message || 'Please try again.'
      })
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
      <Header />

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                    {quickPrompts.map((prompt, index) => (
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
