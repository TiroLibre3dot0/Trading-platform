import { Asset } from "../lib/useMockFeed";

const AssetTicker = ({ assets }: { assets: Asset[] }) => {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-white">Mercati in evidenza</div>
        <div className="text-xs text-white/60">Sentiment in tempo reale</div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <div key={asset.symbol} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">{asset.symbol}</div>
                <div className="text-xs text-white/60">{asset.name}</div>
              </div>
              <div
                className={`text-sm font-semibold ${asset.change >= 0 ? "text-emerald-300" : "text-red-300"}`}
              >
                {asset.change >= 0 ? "+" : ""}
                {asset.change}%
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-lg font-semibold text-white">{asset.price}</div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <div className="h-2 w-20 rounded-full bg-white/5 border border-white/20">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                    style={{ width: `${asset.sentiment}%` }}
                  />
                </div>
                <span>{asset.sentiment}% buy</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetTicker;
