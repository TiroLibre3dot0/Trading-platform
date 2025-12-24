import { useMemo, useState } from "react";
import { Asset } from "../lib/useMockFeed";

type Props = {
  assets: Asset[];
};

type Side = "buy" | "sell";

const OrderForm = ({ assets }: Props) => {
  const [symbol, setSymbol] = useState(assets[0]?.symbol ?? "BTC");
  const [side, setSide] = useState<Side>("buy");
  const [size, setSize] = useState(0.25);
  const [leverage, setLeverage] = useState(100);
  const [sl, setSl] = useState(0);
  const [tp, setTp] = useState(0);

  const asset = useMemo(() => assets.find((a) => a.symbol === symbol), [assets, symbol]);
  const price = asset?.price ?? 0;

  const notional = Number((price * size).toFixed(2));
  const margin = leverage > 0 ? Number((notional / leverage).toFixed(2)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: send to trading backend
    alert(
      `Ordine ${side.toUpperCase()} ${symbol} size ${size}\nPrezzo: ${price}\nSL: ${sl || "-"} TP: ${tp || "-"}\nNotional: $${notional} | Margine stimato: $${margin}`
    );
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-brand-600">Ordine rapido demo</div>
          <div className="text-lg font-semibold text-slate-900">{symbol}</div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSide("buy")}
            className={`px-3 py-1 rounded-lg text-sm font-semibold border ${side === "buy" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-600 border-brand-100"}`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide("sell")}
            className={`px-3 py-1 rounded-lg text-sm font-semibold border ${side === "sell" ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-slate-600 border-brand-100"}`}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="space-y-1">
          <span className="text-slate-600">Strumento</span>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full rounded-xl bg-white border border-brand-100 px-3 py-2"
          >
            {assets.map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol} — {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-slate-600">Size (lotti)</span>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full rounded-xl bg-white border border-brand-100 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="text-slate-600">Leva</span>
          <input
            type="number"
            min={1}
            max={500}
            step={10}
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full rounded-xl bg-white border border-brand-100 px-3 py-2"
          />
        </label>
        <div className="rounded-xl bg-brand-50 p-3 border border-brand-100">
          <div className="text-slate-600">Prezzo corrente</div>
          <div className="text-lg font-semibold text-slate-900">{price}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="space-y-1">
          <span className="text-slate-600">Stop Loss</span>
          <input
            type="number"
            value={sl || ""}
            onChange={(e) => setSl(Number(e.target.value))}
            placeholder="Opzionale"
            className="w-full rounded-xl bg-white border border-brand-100 px-3 py-2"
          />
        </label>
        <label className="space-y-1">
          <span className="text-slate-600">Take Profit</span>
          <input
            type="number"
            value={tp || ""}
            onChange={(e) => setTp(Number(e.target.value))}
            placeholder="Opzionale"
            className="w-full rounded-xl bg-white border border-brand-100 px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-brand-50 p-3 border border-brand-100">
          <div className="text-slate-600">Notional stimato</div>
          <div className="text-lg font-semibold text-slate-900">${notional}</div>
        </div>
        <div className="rounded-xl bg-brand-50 p-3 border border-brand-100">
          <div className="text-slate-600">Margine richiesto</div>
          <div className="text-lg font-semibold text-slate-900">${margin}</div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 transition font-semibold py-3 text-white shadow-sm shadow-brand-200/60"
      >
        Invia ordine demo
      </button>
    </form>
  );
};

export default OrderForm;
