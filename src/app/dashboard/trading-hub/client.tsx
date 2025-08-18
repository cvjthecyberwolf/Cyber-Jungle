'use client';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme, ThemeProvider } from 'next-themes';

const chartData = [
  { date: '2023-01', value: 1.0800 },
  { date: '2023-02', value: 1.0825 },
  { date: '2023-03', value: 1.0790 },
  { date: '2023-04', value: 1.0850 },
  { date: '2023-05', value: 1.0875 },
  { date: '2023-06', value: 1.0900 },
  { date: '2023-07', value: 1.0860 },
  { date: '2023-08', value: 1.0910 },
  { date: '2023-09', value: 1.0950 },
  { date: '2023-10', value: 1.0920 },
  { date: '2023-11', value: 1.0980 },
  { date: '2023-12', value: 1.1000 },
];

function Chart() {
  const { theme } = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toFixed(4)}`}
          domain={['dataMin - 0.005', 'dataMax + 0.005']}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          }}
        />
        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function TradingChartClient() {
  return (
    <ThemeProvider attribute="class">
      <Chart />
    </ThemeProvider>
  );
}
