import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TradingChartClient } from "./client";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const cryptoData = [
  { name: 'Bitcoin', symbol: 'BTC', price: 68450.78, change: 2.35, icon: 'https://placehold.co/32x32.png' },
  { name: 'Ethereum', symbol: 'ETH', price: 3560.21, change: -1.12, icon: 'https://placehold.co/32x32.png' },
  { name: 'Solana', symbol: 'SOL', price: 150.45, change: 5.89, icon: 'https://placehold.co/32x32.png' },
  { name: 'XRP', symbol: 'XRP', price: 0.52, change: 0.25, icon: 'https://placehold.co/32x32.png' },
];

const forexData = [
  { pair: 'EUR/USD', price: 1.0856, change: -0.21 },
  { pair: 'GBP/USD', price: 1.2714, change: 0.05 },
  { pair: 'USD/JPY', price: 157.25, change: 0.45 },
  { pair: 'AUD/USD', price: 0.6650, change: -0.32 },
];

export default function TradingHubPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <div className="lg:col-span-5">
        <Card className="h-full bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline">Market Analysis</CardTitle>
            <CardDescription>EUR/USD Price Chart</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] lg:h-[500px]">
            <TradingChartClient />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Crypto Watchlist</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cryptoData.map((crypto) => (
                  <TableRow key={crypto.symbol}>
                    <TableCell className="font-medium">{crypto.symbol}</TableCell>
                    <TableCell className="text-right">${crypto.price.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-semibold ${crypto.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Forex Majors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forexData.map((forex) => (
                  <TableRow key={forex.pair}>
                    <TableCell className="font-medium">{forex.pair}</TableCell>
                    <TableCell className="text-right">{forex.price.toFixed(4)}</TableCell>
                    <TableCell className={`text-right font-semibold ${forex.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {forex.change > 0 ? '+' : ''}{forex.change.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardHeader>
              <CardTitle className="font-headline text-lg">Trading Signal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center">
              <Badge variant="default" className="text-base bg-green-500/20 text-green-300 border-green-500/30">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                STRONG BUY
              </Badge>
              <p className="text-2xl font-bold mt-2">EUR/USD</p>
              <p className="text-muted-foreground">Recommendation based on technical analysis.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
