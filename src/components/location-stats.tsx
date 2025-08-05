// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// export default function Location({stats}: {stats: any[]}) {

//     console.log(stats)
//     const cityCount = stats.reduce((acc: any, stat: any) => {
//         if (acc[stat.city]) {
//             acc[stat.city] += 1
//         } else {
//             acc[stat.city] = 1
//         }
//         return acc
//     }, {})
    
//     const cities = Object.entries(cityCount).map(([city, count]) => ({
//         city,
//         count,
//     }))

//     return (
//         <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//             width={700}
//             height={300}
//             data={cities.slice(0, 5)}
//             margin={{
//                 top: 5,
//                 right: 30,
//                 left: 20,
//                 bottom: 5,
//             }}
//             >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="city" />
//             <YAxis />
//             <Tooltip labelStyle={{color:"green"}}/>
//             <Legend />
//             <Line type="monotone" dataKey="count" stroke="#8884d8" />
//             </LineChart>
//         </ResponsiveContainer>
//     );
// }

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Location({ stats }: { stats: any[] }) {
    // Transform the data to count city occurrences
    const cityCount = stats.reduce((acc: Record<string, number>, stat: any) => {
        const city = stat.city || 'Unknown'; // Handle potential undefined cities
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});

    // Convert to array and sort by count (descending)
    const cities = Object.entries(cityCount)
        .map(([city, count]) => ({
            name: city,  // Changed from 'city' to 'name' for better Recharts compatibility
            count,
        }))
        .sort((a, b) => a.count - b.count); // Sort by count descending

    // Add some minimum height to ensure the chart is visible
    const containerHeight = Math.max(300, cities.length * 50);

    return (
        <div style={{ width: '100%', height: `${containerHeight}px` }}>
            <ResponsiveContainer>
                <LineChart
                    data={cities.slice(0, 10)} // Show top 10 cities
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}