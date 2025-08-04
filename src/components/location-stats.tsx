import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Location({stats}) {

    const cityCount = stats.reduce((acc, stat) => {
        if (acc[stat.city]) {
            acc[stat.city] += 1
        } else {
            acc[stat.city] = 1
        }
        return acc
    }, {})
    
    const cities = Object.entries(cityCount).map(([city, count]) => ({
        city,
        count,
    }))

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            width={700}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip labelStyle={{color:"green"}}/>
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
}
