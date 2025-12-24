import { useEffect, useState } from "react";

type Asset = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  sentiment: number;
};

const seed: Asset[] = [
  { symbol: "NAS100", name: "Nasdaq 100", price: 25332.7, change: 0.64, sentiment: 65 },
  { symbol: "XAU", name: "Oro", price: 4314.5, change: -0.28, sentiment: 69 },
  { symbol: "BTC", name: "Bitcoin", price: 94210, change: 1.12, sentiment: 58 },
  { symbol: "NG", name: "Gas Naturale", price: 4.006, change: -0.42, sentiment: 74 },
  { symbol: "DAX", name: "Germania 40", price: 24215, change: 0.21, sentiment: 61 },
  { symbol: "EURUSD", name: "EUR/USD", price: 1.0831, change: 0.12, sentiment: 52 },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const useMockFeed = () => {
  const [assets, setAssets] = useState<Asset[]>(seed);

  useEffect(() => {
    const id = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => {
          const drift = (Math.random() - 0.5) * 0.35; // random intraday drift
          const change = clamp(a.change + drift, -2.5, 2.5);
          const price = clamp(a.price * (1 + drift / 1000), a.price * 0.98, a.price * 1.02);
          const sentiment = clamp(a.sentiment + (Math.random() - 0.5) * 4, 35, 80);
          return { ...a, change: Number(change.toFixed(2)), price: Number(price.toFixed(4)), sentiment: Math.round(sentiment) };
        })
      );
    }, 1500);

    return () => clearInterval(id);
  }, []);

  return assets;
};

export type { Asset };
