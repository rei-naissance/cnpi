import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts'
import { aggregateByDevice } from '@/features/analytics/utils'
import type { Click } from '@/types'

const DEVICE_COLORS: Record<string, string> = {
  Desktop: '#0088FE',
  Mobile: '#00C49F',
  Unknown: '#FFBB28',
}

export default function DeviceStats({ stats }: { stats: Click[] }) {
  const data = aggregateByDevice(stats)

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${String(name ?? '')}: ${((percent ?? 0) * 100).toFixed(1)}%`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={DEVICE_COLORS[entry.name] ?? '#FF8042'}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(_, __, props) => [
              (props.payload as { percent: string }).percent,
              (props.payload as { name: string }).name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
