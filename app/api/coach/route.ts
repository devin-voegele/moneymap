import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, convertToMonthly } from '@/lib/utils'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Fetch user and check plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        plan: true, 
        monthlyAiRequests: true, 
        aiRequestsResetAt: true 
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if FREE tier and enforce limits
    if (user.plan === 'FREE') {
      // Reset counter if it's a new month
      const now = new Date()
      const resetDate = new Date(user.aiRequestsResetAt)
      
      if (now > resetDate) {
        // Reset the counter
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            monthlyAiRequests: 0,
            aiRequestsResetAt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
          }
        })
        user.monthlyAiRequests = 0
      }

      // Check if limit reached (5 questions per month for free tier)
      const FREE_TIER_LIMIT = 5
      if (user.monthlyAiRequests >= FREE_TIER_LIMIT) {
        return NextResponse.json({ 
          error: 'FREE_TIER_LIMIT',
          message: `You've reached your limit of ${FREE_TIER_LIMIT} AI coach questions this month. Upgrade to Pro for unlimited questions!`,
          limit: FREE_TIER_LIMIT,
          used: user.monthlyAiRequests
        }, { status: 403 })
      }

      // Increment counter for free users
      await prisma.user.update({
        where: { id: session.user.id },
        data: { monthlyAiRequests: { increment: 1 } }
      })
    }

    // Fetch ALL user data to build context
    const [profile, incomes, fixedCosts, subscriptions, goals] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: session.user.id } }),
      prisma.income.findMany({ where: { userId: session.user.id } }),
      prisma.fixedCost.findMany({ where: { userId: session.user.id } }),
      prisma.subscription.findMany({ where: { userId: session.user.id } }),
      prisma.goal.findMany({ where: { userId: session.user.id } }),
    ])

    // Calculate totals
    const totalIncome = incomes.reduce((sum, inc) => sum + convertToMonthly(inc.amount, inc.frequency), 0)
    const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + convertToMonthly(cost.amount, cost.frequency), 0)
    const totalSubscriptions = subscriptions.reduce((sum, sub) => sum + convertToMonthly(sub.amount, sub.frequency), 0)
    const freeMoney = totalIncome - totalFixedCosts - totalSubscriptions

    // Build detailed context for AI
    const currency = profile?.currency || 'EUR'
    
    let contextMessage = `You are MoneyMap AI Coach, a friendly and helpful financial assistant for young adults (15-30 years old). You help users understand their budget, manage subscriptions, and reach savings goals using simple, non-technical language.

IMPORTANT RULES:
- You are NOT a professional financial advisor. Never give specific investment advice or recommend financial products.
- Focus only on budgeting, expenses, subscriptions, and savings habits.
- Use simple language, short paragraphs, and bullet points.
- Be encouraging and positive, but honest about financial situations.
- Always reference specific numbers from the user's data when giving advice.
- If the user asks about something you don't have data for, acknowledge it and suggest they add it to MoneyMap.

YOUR CAPABILITIES:
- You CAN create goals, subscriptions, income sources, and fixed costs for the user
- You CAN generate Excel reports with all their financial data (income, expenses, subscriptions, goals)
- When users ask for exports, reports, spreadsheets, or Excel files, use the export_excel_report function
- The Excel report includes multiple sheets: Overview, Income, Fixed Costs, Subscriptions, and Goals

USER'S FINANCIAL DATA:
`

    // Income
    contextMessage += `\n📊 INCOME (Monthly Total: ${formatCurrency(totalIncome, currency)}):\n`
    if (incomes.length === 0) {
      contextMessage += `- No income sources added yet\n`
    } else {
      incomes.forEach(inc => {
        const monthly = convertToMonthly(inc.amount, inc.frequency)
        contextMessage += `- ${inc.name}: ${formatCurrency(inc.amount, currency)} ${inc.frequency.toLowerCase()} (${formatCurrency(monthly, currency)}/month)\n`
      })
    }

    // Fixed Costs
    contextMessage += `\n💰 FIXED COSTS (Monthly Total: ${formatCurrency(totalFixedCosts, currency)}):\n`
    if (fixedCosts.length === 0) {
      contextMessage += `- No fixed costs added yet\n`
    } else {
      fixedCosts.forEach(cost => {
        const monthly = convertToMonthly(cost.amount, cost.frequency)
        contextMessage += `- ${cost.name} (${cost.category}): ${formatCurrency(cost.amount, currency)} ${cost.frequency.toLowerCase()} (${formatCurrency(monthly, currency)}/month)\n`
      })
    }

    // Subscriptions
    contextMessage += `\n📺 SUBSCRIPTIONS (Monthly Total: ${formatCurrency(totalSubscriptions, currency)}):\n`
    if (subscriptions.length === 0) {
      contextMessage += `- No subscriptions tracked yet\n`
    } else {
      subscriptions.forEach(sub => {
        const monthly = convertToMonthly(sub.amount, sub.frequency)
        const worthIt = sub.worthIt ? ` [User marked as: ${sub.worthIt}]` : ''
        contextMessage += `- ${sub.name}${sub.category ? ` (${sub.category})` : ''}: ${formatCurrency(sub.amount, currency)} ${sub.frequency.toLowerCase()} (${formatCurrency(monthly, currency)}/month)${worthIt}\n`
      })
    }

    // Goals
    contextMessage += `\n🎯 SAVINGS GOALS:\n`
    if (goals.length === 0) {
      contextMessage += `- No savings goals set yet\n`
    } else {
      goals.forEach(goal => {
        const remaining = goal.targetAmount - goal.currentAmount
        const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
        let deadlineInfo = ''
        if (goal.deadline) {
          const deadline = new Date(goal.deadline)
          const now = new Date()
          const monthsLeft = Math.max(1, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))
          const requiredMonthly = remaining / monthsLeft
          deadlineInfo = ` | Deadline: ${deadline.toLocaleDateString()} (${monthsLeft} months left) | Need to save: ${formatCurrency(requiredMonthly, currency)}/month`
        }
        contextMessage += `- ${goal.name}: ${formatCurrency(goal.currentAmount, currency)} of ${formatCurrency(goal.targetAmount, currency)} (${progress}% complete)${deadlineInfo}\n`
      })
    }

    // Summary
    contextMessage += `\n💵 MONTHLY SUMMARY:\n`
    contextMessage += `- Total Income: ${formatCurrency(totalIncome, currency)}\n`
    contextMessage += `- Fixed Costs: ${formatCurrency(totalFixedCosts, currency)} (${totalIncome > 0 ? ((totalFixedCosts / totalIncome) * 100).toFixed(1) : 0}% of income)\n`
    contextMessage += `- Subscriptions: ${formatCurrency(totalSubscriptions, currency)} (${totalIncome > 0 ? ((totalSubscriptions / totalIncome) * 100).toFixed(1) : 0}% of income)\n`
    contextMessage += `- Free Money: ${formatCurrency(freeMoney, currency)} (${totalIncome > 0 ? ((freeMoney / totalIncome) * 100).toFixed(1) : 0}% of income)\n`
    contextMessage += `- Yearly Subscription Cost: ${formatCurrency(totalSubscriptions * 12, currency)}\n`

    // User context
    if (profile) {
      contextMessage += `\n👤 USER PROFILE:\n`
      contextMessage += `- Currency: ${profile.currency}\n`
      if (profile.country) contextMessage += `- Country: ${profile.country}\n`
      if (profile.persona) contextMessage += `- Situation: ${profile.persona}\n`
    }

    contextMessage += `\nNow answer the user's question based on this data. Be specific, reference actual numbers, and give actionable advice.

FORMATTING RULES:
- Use markdown formatting (bold, lists, etc.)
- Keep responses concise and scannable
- Use bullet points for lists
- Use **bold** for important numbers and key points
- Break long responses into short paragraphs
- Use emojis sparingly for visual interest
- Don't use headers unless necessary`

    // Define available tools for AI
    const tools = [
      {
        type: 'function',
        function: {
          name: 'create_goal',
          description: 'Create a new savings goal for the user',
          parameters: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the goal (e.g., "iPhone 15", "New PC", "Summer Holiday")'
              },
              targetAmount: {
                type: 'number',
                description: 'The target amount to save in the user\'s currency'
              },
              currentAmount: {
                type: 'number',
                description: 'The amount already saved (default 0)'
              },
              deadline: {
                type: 'string',
                description: 'The target date in ISO format (YYYY-MM-DD), optional'
              }
            },
            required: ['name', 'targetAmount']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_subscription',
          description: 'Add a new subscription for the user to track',
          parameters: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the subscription (e.g., "Netflix", "Spotify")'
              },
              amount: {
                type: 'number',
                description: 'The subscription cost'
              },
              frequency: {
                type: 'string',
                enum: ['MONTHLY', 'YEARLY'],
                description: 'How often the subscription is charged'
              },
              category: {
                type: 'string',
                description: 'Category like Entertainment, Gaming, Software, etc.'
              }
            },
            required: ['name', 'amount', 'frequency']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_income',
          description: 'Add a new income source for the user',
          parameters: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the income source (e.g., "Monthly Salary", "Part-time Job")'
              },
              amount: {
                type: 'number',
                description: 'The income amount'
              },
              frequency: {
                type: 'string',
                enum: ['MONTHLY', 'WEEKLY', 'YEARLY'],
                description: 'How often the income is received'
              }
            },
            required: ['name', 'amount', 'frequency']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_fixed_cost',
          description: 'Add a new fixed cost/expense for the user',
          parameters: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the expense (e.g., "Rent", "Groceries")'
              },
              amount: {
                type: 'number',
                description: 'The expense amount'
              },
              frequency: {
                type: 'string',
                enum: ['MONTHLY', 'WEEKLY', 'YEARLY'],
                description: 'How often the expense occurs'
              },
              category: {
                type: 'string',
                description: 'Category like Rent, Food, Transport, etc.'
              }
            },
            required: ['name', 'amount', 'frequency', 'category']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'export_excel_report',
          description: 'Generate and download a detailed Excel report with all budget data, expenses, subscriptions, and goals. Use this when the user asks for an export, report, spreadsheet, or Excel file.',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      }
    ]

    // Call OpenAI with function calling
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: contextMessage
        },
        {
          role: 'user',
          content: message
        }
      ],
      tools: tools as any,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 600,
    })

    const responseMessage = completion.choices[0]?.message

    // Check if AI wants to call a function
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0]
      const functionName = toolCall.function.name
      const functionArgs = JSON.parse(toolCall.function.arguments)

      let functionResult = ''

      // Execute the function
      try {
        switch (functionName) {
          case 'create_goal':
            const goalData = {
              name: functionArgs.name,
              targetAmount: functionArgs.targetAmount,
              currentAmount: functionArgs.currentAmount || 0,
              deadline: functionArgs.deadline ? new Date(functionArgs.deadline) : null,
            }
            await prisma.goal.create({
              data: {
                ...goalData,
                userId: session.user.id,
              }
            })
            functionResult = `Goal "${goalData.name}" created successfully with target of ${formatCurrency(goalData.targetAmount, currency)}${goalData.deadline ? ` by ${new Date(goalData.deadline).toLocaleDateString()}` : ''}.`
            break

          case 'create_subscription':
            const subData = {
              name: functionArgs.name,
              amount: functionArgs.amount,
              frequency: functionArgs.frequency,
              category: functionArgs.category || null,
            }
            await prisma.subscription.create({
              data: {
                ...subData,
                userId: session.user.id,
              }
            })
            functionResult = `Subscription "${subData.name}" added successfully (${formatCurrency(subData.amount, currency)} ${subData.frequency.toLowerCase()}).`
            break

          case 'create_income':
            const incomeData = {
              name: functionArgs.name,
              amount: functionArgs.amount,
              frequency: functionArgs.frequency,
            }
            await prisma.income.create({
              data: {
                ...incomeData,
                userId: session.user.id,
              }
            })
            functionResult = `Income source "${incomeData.name}" added successfully (${formatCurrency(incomeData.amount, currency)} ${incomeData.frequency.toLowerCase()}).`
            break

          case 'create_fixed_cost':
            const costData = {
              name: functionArgs.name,
              amount: functionArgs.amount,
              frequency: functionArgs.frequency,
              category: functionArgs.category,
            }
            await prisma.fixedCost.create({
              data: {
                ...costData,
                userId: session.user.id,
              }
            })
            functionResult = `Fixed cost "${costData.name}" added successfully (${formatCurrency(costData.amount, currency)} ${costData.frequency.toLowerCase()}).`
            break

          case 'export_excel_report':
            functionResult = 'EXCEL_EXPORT_REQUESTED'
            break

          default:
            functionResult = 'Function not recognized.'
        }

        // Get AI to respond with the result
        const finalCompletion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: contextMessage
            },
            {
              role: 'user',
              content: message
            },
            {
              role: 'assistant',
              content: null,
              tool_calls: responseMessage.tool_calls
            },
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: functionResult
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        })

        const finalResponse = finalCompletion.choices[0]?.message?.content || functionResult

        // Special handling for Excel export
        if (functionName === 'export_excel_report') {
          return NextResponse.json({ 
            response: finalResponse,
            actionTaken: true,
            functionCalled: functionName,
            excelExport: true
          })
        }

        return NextResponse.json({ 
          response: finalResponse,
          actionTaken: true,
          functionCalled: functionName
        })

      } catch (error) {
        console.error('Function execution error:', error)
        return NextResponse.json({ 
          response: `I tried to ${functionName.replace('_', ' ')} but encountered an error. ${functionResult || 'Please try again.'}` 
        })
      }
    }

    // No function call, return normal response
    const response = responseMessage?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response })

  } catch (error: any) {
    console.error('AI Coach error:', error)
    
    // Check if it's an OpenAI API error
    if (error?.status === 401) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      error: 'Failed to get AI response. Please try again.' 
    }, { status: 500 })
  }
}
