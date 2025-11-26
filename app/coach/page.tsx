'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PieChart, LogOut, Settings, Send, Loader2, Sparkles, Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import Header from '@/components/Header'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Conversation = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE')
  const [aiUsage, setAiUsage] = useState({ used: 0, limit: 5 })
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch user plan, usage, and conversations
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileRes, conversationsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/coach/conversations')
        ])
        
        if (profileRes.ok) {
          const data = await profileRes.json()
          setUserPlan(data.plan || 'FREE')
          setAiUsage({
            used: data.monthlyAiRequests || 0,
            limit: 5
          })
        }

        if (conversationsRes.ok) {
          const data = await conversationsRes.json()
          setConversations(data.conversations || [])
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
    fetchUserData()
  }, [])

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
        setAiUsage({ used: data.limit, limit: data.limit })
        return
      }

      // Update usage count for free users
      if (userPlan === 'FREE') {
        setAiUsage(prev => ({ ...prev, used: prev.used + 1 }))
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

      // Auto-save conversation after successful response
      await saveConversation()
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

  const saveConversation = async () => {
    if (messages.length === 0) return

    try {
      if (!currentConversationId) {
        // Create new conversation
        const res = await fetch('/api/coach/conversations', {
          method: 'POST'
        })
        const data = await res.json()
        const newId = data.conversation.id
        setCurrentConversationId(newId)

        // Generate title from first message
        const title = messages[0]?.content.slice(0, 50) + (messages[0]?.content.length > 50 ? '...' : '')
        
        // Save messages
        await fetch(`/api/coach/conversations/${newId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, title })
        })

        // Refresh conversations list
        const conversationsRes = await fetch('/api/coach/conversations')
        if (conversationsRes.ok) {
          const data = await conversationsRes.json()
          setConversations(data.conversations || [])
        }
      } else {
        // Update existing conversation
        await fetch(`/api/coach/conversations/${currentConversationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages })
        })
      }
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentConversationId(null)
    setSidebarOpen(false)
  }

  const handleLoadConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/coach/conversations/${id}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.conversation.messages || [])
        setCurrentConversationId(id)
        setSidebarOpen(false)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
      toast.error('Failed to load conversation')
    }
  }

  const handleDeleteConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/coach/conversations/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== id))
        if (currentConversationId === id) {
          handleNewChat()
        }
        toast.success('Conversation deleted')
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      toast.error('Failed to delete conversation')
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
      <main className="flex-1 container mx-auto px-4 py-6 flex gap-4 max-w-7xl">
        {/* Sidebar - Chat History */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Chats</h3>
              <Button size="sm" onClick={handleNewChat} className="h-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">
                  No conversations yet
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group p-3 rounded-lg cursor-pointer transition ${
                      currentConversationId === conv.id
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        className="flex-1 min-w-0"
                        onClick={() => handleLoadConversation(conv.id)}
                      >
                        <p className="text-white text-sm truncate">
                          {conv.title}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteConversation(conv.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
        {/* Usage Indicator for Free Users */}
        {userPlan === 'FREE' && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">
                    {aiUsage.used}/{aiUsage.limit} AI questions used this month
                  </p>
                  <p className="text-slate-400 text-sm">
                    {aiUsage.used >= aiUsage.limit 
                      ? 'Upgrade to Pro for unlimited questions!' 
                      : `${aiUsage.limit - aiUsage.used} questions remaining`}
                  </p>
                </div>
              </div>
              <Link href="/settings/billing">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(aiUsage.used / aiUsage.limit) * 100}%` }}
              />
            </div>
          </div>
        )}

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
        </div>
      </main>
    </div>
  )
}
