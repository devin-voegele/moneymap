import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        incomes: true,
        fixedCosts: true,
        subscriptions: true,
        goals: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate totals
    const totalIncome = user.incomes.reduce((sum: number, income: any) => sum + income.amount, 0)
    const totalFixedCosts = user.fixedCosts.reduce((sum: number, cost: any) => sum + cost.amount, 0)
    const totalSubscriptions = user.subscriptions.reduce((sum: number, sub: any) => sum + sub.amount, 0)
    const freeMoney = totalIncome - totalFixedCosts - totalSubscriptions

    // Create workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'MoneyMap'
    workbook.created = new Date()

    // Overview Sheet
    const overviewSheet = workbook.addWorksheet('Overview', {
      properties: { tabColor: { argb: '3B82F6' } }
    })
    
    overviewSheet.columns = [
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Amount (€)', key: 'amount', width: 15 },
      { header: 'Percentage', key: 'percentage', width: 15 },
    ]

    // Style header
    overviewSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } }
    overviewSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3B82F6' }
    }

    // Add overview data
    overviewSheet.addRow({
      category: 'Total Income',
      amount: totalIncome,
      percentage: '100%'
    })
    overviewSheet.addRow({
      category: 'Fixed Costs',
      amount: totalFixedCosts,
      percentage: `${((totalFixedCosts / totalIncome) * 100).toFixed(1)}%`
    })
    overviewSheet.addRow({
      category: 'Subscriptions',
      amount: totalSubscriptions,
      percentage: `${((totalSubscriptions / totalIncome) * 100).toFixed(1)}%`
    })
    overviewSheet.addRow({
      category: 'Available Money',
      amount: freeMoney,
      percentage: `${((freeMoney / totalIncome) * 100).toFixed(1)}%`
    })

    // Income Sheet
    const incomeSheet = workbook.addWorksheet('Income Sources')
    incomeSheet.columns = [
      { header: 'Source', key: 'source', width: 30 },
      { header: 'Amount (€)', key: 'amount', width: 15 },
    ]
    incomeSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } }
    incomeSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '10B981' }
    }
    user.incomes.forEach((income: any) => {
      incomeSheet.addRow({ source: income.source, amount: income.amount })
    })

    // Fixed Costs Sheet
    const fixedCostsSheet = workbook.addWorksheet('Fixed Costs')
    fixedCostsSheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Amount (€)', key: 'amount', width: 15 },
    ]
    fixedCostsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } }
    fixedCostsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F97316' }
    }
    user.fixedCosts.forEach((cost: any) => {
      fixedCostsSheet.addRow({ name: cost.name, amount: cost.amount })
    })

    // Subscriptions Sheet
    const subscriptionsSheet = workbook.addWorksheet('Subscriptions')
    subscriptionsSheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Amount (€)', key: 'amount', width: 15 },
      { header: 'Billing Cycle', key: 'cycle', width: 15 },
    ]
    subscriptionsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } }
    subscriptionsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EF4444' }
    }
    user.subscriptions.forEach((sub: any) => {
      subscriptionsSheet.addRow({ 
        name: sub.name, 
        amount: sub.amount,
        cycle: sub.billingCycle 
      })
    })

    // Goals Sheet
    const goalsSheet = workbook.addWorksheet('Goals')
    goalsSheet.columns = [
      { header: 'Goal', key: 'name', width: 30 },
      { header: 'Target (€)', key: 'target', width: 15 },
      { header: 'Current (€)', key: 'current', width: 15 },
      { header: 'Progress', key: 'progress', width: 15 },
      { header: 'Deadline', key: 'deadline', width: 15 },
    ]
    goalsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } }
    goalsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8B5CF6' }
    }
    user.goals.forEach((goal: any) => {
      const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
      goalsSheet.addRow({ 
        name: goal.name, 
        target: goal.targetAmount,
        current: goal.currentAmount,
        progress: `${progress}%`,
        deadline: goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'
      })
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="MoneyMap_Report_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json({ error: 'Failed to generate Excel report' }, { status: 500 })
  }
}
