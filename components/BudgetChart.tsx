'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

type ChartData = {
  name: string
  value: number
  color: string
}

type BudgetChartProps = {
  data: ChartData[]
  totalIncome: number
}

export default function BudgetChart({ data, totalIncome }: BudgetChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      const percentage = totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(1) : 0
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{item.name}</p>
          <p className="text-slate-300">{formatCurrency(item.value)}</p>
          <p className="text-slate-400 text-sm">{percentage}% of income</p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col gap-2 mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = totalIncome > 0 ? ((entry.payload.value / totalIncome) * 100).toFixed(1) : 0
          return (
            <div key={`legend-${index}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-300 text-sm">{entry.value}</span>
              </div>
              <div className="text-right">
                <span className="text-white font-medium text-sm">
                  {formatCurrency(entry.payload.value)}
                </span>
                <span className="text-slate-400 text-xs ml-2">({percentage}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
