import type { Click } from '@/types'

export function aggregateByCity(clicks: Click[]): { name: string; count: number }[] {
  const cityCount = clicks.reduce((acc: Record<string, number>, click) => {
    const city = click.city ?? 'Unknown'
    acc[city] = (acc[city] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(cityCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export function aggregateByDevice(clicks: Click[]): {
  name: string
  value: number
  percent: string
}[] {
  const deviceCount = clicks.reduce((acc: Record<string, number>, click) => {
    const device = (click.device ?? 'unknown').toLowerCase()
    acc[device] = (acc[device] ?? 0) + 1
    return acc
  }, {})

  const total = clicks.length
  return Object.entries(deviceCount).map(([device, count]) => ({
    name: device.charAt(0).toUpperCase() + device.slice(1),
    value: count,
    percent: ((count / total) * 100).toFixed(1) + '%',
  }))
}
