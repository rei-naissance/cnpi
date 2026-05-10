import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { aggregateByCity } from '@/features/analytics/utils'
import type { Click } from '@/types'

export default function LocationStats({ stats }: { stats: Click[] }) {
  const cities = aggregateByCity(stats)
  const containerHeight = Math.max(300, cities.length * 50)

  return (
    <div style={{ width: '100%', height: `${containerHeight}px` }}>
      <ResponsiveContainer>
        <LineChart
          data={cities}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
