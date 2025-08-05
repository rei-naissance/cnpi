import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';

export default function Device({ stats }: { stats: any[] }) {
    // Count device occurrences
    const deviceCount = stats.reduce((acc, stat) => {
        const device = stat.device?.toLowerCase() || 'unknown'; // Normalize to lowercase
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Transform to chart data with percentages
    const total = stats.length;
    const data = Object.entries(deviceCount).map(([device, count]) => ({
        name: device.charAt(0).toUpperCase() + device.slice(1), // Capitalize first letter
        value: count,
        percent: ((count as number) / total * 100).toFixed(1) + '%'
    }));

    // Colors for the pie segments
    const COLORS = {
        desktop: '#0088FE',
        mobile: '#00C49F',
        unknown: '#FFBB28'
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${percent}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#FF8042'} 
                            />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value, name, props) => [
                            props.payload.percent, 
                            props.payload.name
                        ]} 
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}