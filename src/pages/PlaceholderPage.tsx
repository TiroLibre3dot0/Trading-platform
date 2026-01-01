import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import mock from '../mock/userDashboardMock';
import { User, Zap, BarChart2, TrendingUp, List, Wallet, Star, Activity } from 'lucide-react';
import TradePage from './TradePage';

function Header({ title, subtitle, Icon }: { title: string, subtitle?: string, Icon?: any }){
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-slate-300" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {subtitle && <div className="text-slate-400 text-sm mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

function Badge({ children, color='slate' }){
  return <span className={`px-2 py-0.5 rounded-full text-xs bg-${color}-800 text-${color}-200`}>{children}</span>;
}

export default function PlaceholderPage({ title }:{title?:string}){
  const page = (title||'').toLowerCase();

  // Shared small helpers
  const fmtMoney = (v: any) => typeof v === 'number' ? `$${v.toLocaleString()}` : v;
  const recentInstruments = useMemo(()=> mock.markets.slice(0,10), []);

  // Trade view now extracted to TradePage.tsx

  // Markets view
  const MarketsView = () => {
    const categories = ['all','forex','crypto','indices','commodities'];
    const [cat, setCat] = useState('forex');
    const [selected, setSelected] = useState(mock.markets[0]?.symbol || '');

    const list = useMemo(()=> mock.markets.filter(m => cat==='all' ? true : m.category===cat), [cat]);

    return (
      <div className="h-full min-w-0 overflow-hidden p-4">
        <Header title="Markets" subtitle="Discover instruments and trade with price transparency" Icon={BarChart2} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 h-[calc(100%-64px)] flex gap-3">
          <div className="w-2/3 overflow-auto" style={{minHeight:0}}>
            <div className="flex gap-2 mb-3">
              {categories.map(c=> (
                <button key={c} onClick={()=>setCat(c)} className={`text-xs px-3 py-1 rounded-full ${cat===c? 'bg-slate-700 text-white' : 'bg-transparent text-slate-400'}`}>{c==='all'? 'All' : c.charAt(0).toUpperCase()+c.slice(1)}</button>
              ))}
            </div>
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="text-slate-400 text-left text-xs">
                  <th>Symbol</th><th>Bid</th><th>Ask</th><th>Spread</th><th>Daily</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map(m=> (
                  <tr key={m.symbol} onClick={()=>setSelected(m.symbol)} className={`border-t border-slate-800 hover:bg-slate-800 cursor-pointer ${selected===m.symbol ? 'bg-slate-800' : ''}`}>
                    <td className="py-2">{m.symbol}<div className="text-xs text-slate-400">{m.name}</div></td>
                    <td className="py-2">{m.bid}</td>
                    <td className="py-2">{m.ask}</td>
                    <td className="py-2">{m.spread}</td>
                    <td className={`py-2 ${m.changePct>=0? 'text-emerald-300' : 'text-rose-300'}`}>{m.changePct}%</td>
                    <td className="py-2 text-xs text-slate-400">{m.tradable? 'Open' : 'Closed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-1/3 bg-slate-800 p-3 rounded overflow-auto" style={{minHeight:0}}>
            <div className="text-sm text-slate-300">Preview</div>
            {mock.markets.filter(m=>m.symbol===selected).map(m=> (
              <div key={m.symbol} className="mt-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{m.symbol}</div>
                  <div className={`text-sm ${m.changePct>=0? 'text-emerald-300' : 'text-rose-300'}`}>{m.changePct}%</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">{m.name}</div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-slate-900 p-2 rounded">Bid<br/><div className="font-medium">{m.bid}</div></div>
                  <div className="bg-slate-900 p-2 rounded">Ask<br/><div className="font-medium">{m.ask}</div></div>
                </div>
                <div className="mt-4">
                  <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition-colors">Quick Buy</button>
                  <button className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded mt-2 transition-colors">Quick Sell</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Open Positions
  const OpenPositionsView = () => {
    return (
      <div className="h-full min-w-0 overflow-hidden p-4">
        <Header title="Open Positions" subtitle="Monitor and manage your active market exposure in real time" Icon={TrendingUp} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 h-[calc(100%-64px)] overflow-hidden flex flex-col">
          <div className="overflow-auto" style={{minHeight:0}}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left text-xs">
                  <th>Symbol</th><th>Dir</th><th>Size</th><th>Entry</th><th>Current</th><th>Unrealized</th><th>SL/TP</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mock.openPositions.map(p=> (
                  <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-800">
                    <td className="py-2">{p.symbol}</td>
                    <td className={`py-2 ${p.side==='Buy' ? 'text-emerald-300' : 'text-rose-300'}`}>{p.side}</td>
                    <td className="py-2">{p.size}</td>
                    <td className="py-2">{p.entry}</td>
                    <td className="py-2">{p.current}</td>
                    <td className={`py-2 ${p.pl>=0? 'text-emerald-300' : 'text-rose-300'}`}>{p.pl>=0? '+' : ''}{p.pl}</td>
                    <td className="py-2 text-xs">SL: - / TP: -</td>
                    <td className="py-2">
                      <button className="px-2 py-1 bg-rose-600 rounded text-xs mr-2">Close</button>
                      <button className="px-2 py-1 bg-slate-800 rounded text-xs">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 border-t border-slate-800 pt-3 flex items-center justify-between text-sm">
            <div>Total exposure: <span className="font-medium">{fmtMoney(mock.kpis.inAccount - mock.kpis.freeMargin)}</span></div>
            <div>Floating P/L: <span className={`font-medium ${mock.positions.reduce((s,p)=>s+p.pl,0)>=0 ? 'text-emerald-300' : 'text-rose-300'}`}>{(mock.positions.reduce((s,p)=>s+p.pl,0))>=0? '+' : ''}{mock.positions.reduce((s,p)=>s+p.pl,0)}</span></div>
          </div>
        </div>
      </div>
    );
  };

  // Closed Positions (derive a history from transactions)
  const ClosedPositionsView = () => {
    const [range, setRange] = useState(30);
    const closed = mock.transactions.filter(t=> t.type==='Trade').slice(0,20);
    const wins = closed.filter(c=> c.amount>0).length;
    const winRate = Math.round(100 * wins / Math.max(1, closed.length));
    const avg = Math.round((closed.reduce((s,c)=>s+c.amount,0))/Math.max(1,closed.length));
    const best = Math.max(...closed.map(c=>c.amount));
    const worst = Math.min(...closed.map(c=>c.amount));

    return (
      <div className="h-full min-w-0 overflow-hidden p-4">
        <Header title="Closed Positions" subtitle="Review completed trades, performance and summaries" Icon={TrendingUp} />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Win rate</div>
            <div className="text-2xl font-semibold mt-1">{winRate}%</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Average P/L</div>
            <div className="text-2xl font-semibold mt-1">{fmtMoney(avg)}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Best / Worst</div>
            <div className="mt-1">{fmtMoney(best)} / <span className="text-rose-300">{fmtMoney(worst)}</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 h-[calc(100%-220px)] overflow-auto" style={{minHeight:0}}>
          <div className="flex items-center gap-3 mb-3">
            <select value={range} onChange={e=>setRange(Number(e.target.value))} className="bg-slate-800 p-2 rounded text-sm">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <select className="bg-slate-800 p-2 rounded text-sm">
              <option>All instruments</option>
              {recentInstruments.map(i=> <option key={i.symbol}>{i.symbol}</option>)}
            </select>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-left text-xs"><th>Symbol</th><th>Side</th><th>Size</th><th>Open</th><th>Close</th><th>Net P/L</th><th>Duration</th></tr>
            </thead>
            <tbody>
              {closed.map((c,idx)=> (
                <tr key={c.id||idx} className="border-t border-slate-800 hover:bg-slate-800">
                  <td className="py-2">{c.symbol || '-'}</td>
                  <td className={`py-2 ${c.amount>0? 'text-emerald-300' : 'text-rose-300'}`}>{c.amount>0? 'Buy' : 'Sell'}</td>
                  <td className="py-2">—</td>
                  <td className="py-2">—</td>
                  <td className="py-2">{c.date}</td>
                  <td className={`py-2 ${c.amount>=0? 'text-emerald-300' : 'text-rose-300'}`}>{fmtMoney(c.amount)}</td>
                  <td className="py-2">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Funds
  const FundsView = () => {
    const location = useLocation();
    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [amountDeposit, setAmountDeposit] = useState(1000);
    const [amountWithdraw, setAmountWithdraw] = useState(500);
    const [methodDeposit, setMethodDeposit] = useState('Bank Transfer');
    const [methodWithdraw, setMethodWithdraw] = useState('Bank');
    const [notesWithdraw, setNotesWithdraw] = useState('');
    const [tab, setTab] = useState(() => {
      const t = new URLSearchParams(location.search).get('tab');
      const allowed = new Set(['overview', 'deposits', 'withdrawals', 'transactions']);
      return t && allowed.has(t) ? t : 'overview';
    });
    const [selectedTx, setSelectedTx] = useState<any|null>(null);

    useEffect(() => {
      const t = new URLSearchParams(location.search).get('tab');
      const allowed = new Set(['overview', 'deposits', 'withdrawals', 'transactions']);
      if (t && allowed.has(t)) setTab(t);
    }, [location.search]);

    return (
      <div className="h-full min-w-0 overflow-hidden p-4">
        <Header title="Funds" subtitle="Manage your funds, deposits, withdrawals, and transaction history" Icon={Wallet} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-[calc(100%-64px)] flex flex-col">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setTab('overview')} className={`px-4 py-2 rounded ${tab === 'overview' ? 'bg-slate-700' : 'bg-slate-800'}`}>Overview</button>
            <button onClick={() => setTab('deposits')} className={`px-4 py-2 rounded ${tab === 'deposits' ? 'bg-slate-700' : 'bg-slate-800'}`}>Deposits</button>
            <button onClick={() => setTab('withdrawals')} className={`px-4 py-2 rounded ${tab === 'withdrawals' ? 'bg-slate-700' : 'bg-slate-800'}`}>Withdrawals</button>
            <button onClick={() => setTab('transactions')} className={`px-4 py-2 rounded ${tab === 'transactions' ? 'bg-slate-700' : 'bg-slate-800'}`}>Transactions</button>
          </div>

          {tab === 'overview' && (
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <div className="flex gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-400">Available balance</div>
                    <div className="text-2xl font-semibold">{fmtMoney(mock.funds.summary.available)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Equity</div>
                    <div className="text-2xl font-semibold">{fmtMoney(mock.accounts[0].equity)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Margin used</div>
                    <div className="text-2xl font-semibold">{fmtMoney(mock.funds.summary.marginUsed)}</div>
                  </div>
                </div>

                <div className="bg-slate-800 p-3 rounded">
                  <div className="text-xs text-slate-400 mb-2">Recent activity</div>
                  <div className="overflow-auto" style={{maxHeight:200}}>
                    <table className="w-full text-sm">
                      <tbody>
                        {mock.funds.history.slice(0, 10).map(h=> (
                          <tr key={h.id} className="border-t border-slate-700">
                            <td className="py-2">{h.date}</td>
                            <td className="py-2">{h.method}</td>
                            <td className="py-2">{fmtMoney(h.amount)}</td>
                            <td className="py-2 text-slate-400">{h.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-300 mb-3">Quick actions</div>
                <button onClick={()=>{ setShowDeposit(true); setMethodDeposit('Bank Transfer'); }} className="w-full mb-2 py-2 bg-emerald-600 rounded">Deposit</button>
                <button onClick={()=>{ setShowWithdraw(true); setMethodWithdraw('Bank'); }} className="w-full mb-4 py-2 bg-rose-600 rounded">Withdraw</button>
                <div className="text-xs text-slate-400">Account ID</div>
                <div className="font-medium mt-1">{mock.accounts[0].id}</div>
              </div>
            </div>
          )}

          {tab === 'deposits' && (
            <div className="flex-1">
              <div className="text-sm text-slate-300 mb-3">Deposit methods</div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button onClick={()=>{ setMethodDeposit('Bank Transfer'); setShowDeposit(true); }} className="bg-slate-800 p-3 rounded">Bank Transfer</button>
                <button onClick={()=>{ setMethodDeposit('Credit Card'); setShowDeposit(true); }} className="bg-slate-800 p-3 rounded">Credit Card</button>
                <button onClick={()=>{ setMethodDeposit('Crypto'); setShowDeposit(true); }} className="bg-slate-800 p-3 rounded">Crypto</button>
              </div>

              <div className="bg-slate-800 p-3 rounded">
                <div className="text-xs text-slate-400 mb-2">Deposit history</div>
                <div className="overflow-auto" style={{maxHeight:300}}>
                  <table className="w-full text-sm">
                    <tbody>
                      {mock.funds.history.filter(h => h.amount > 0).map(h=> (
                        <tr key={h.id} className="border-t border-slate-700">
                          <td className="py-2">{h.date}</td>
                          <td className="py-2">{h.method}</td>
                          <td className="py-2 text-emerald-300">{fmtMoney(h.amount)}</td>
                          <td className="py-2 text-slate-400">{h.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'withdrawals' && (
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <div className="text-sm text-slate-400">Amount</div>
                <input type="number" value={amountWithdraw} onChange={e=>setAmountWithdraw(Number(e.target.value))} className="w-48 bg-slate-800 p-2 rounded mt-1" />
                <div className="text-sm text-slate-400 mt-3">Destination</div>
                <select value={methodWithdraw} onChange={e=>setMethodWithdraw(e.target.value)} className="bg-slate-800 p-2 rounded mt-1 w-48">
                  <option>Bank</option>
                  <option>Crypto</option>
                  <option>Card</option>
                </select>
                <div className="mt-3 text-sm text-slate-400">Notes</div>
                <textarea value={notesWithdraw} onChange={e=>setNotesWithdraw(e.target.value)} className="w-full bg-slate-800 p-2 rounded mt-1" rows={4} />
                <div className="mt-4"><button className="px-4 py-2 bg-emerald-600 rounded">Request Withdrawal</button></div>
              </div>

              <div>
                <div className="text-sm text-slate-400">Fees</div>
                <div className="mt-1">Bank: $15, Crypto: 0.0005 BTC</div>
                <div className="text-sm text-slate-400 mt-3">Processing time</div>
                <div className="mt-1">Bank: 1-3 business days, Crypto: ~1 hour</div>
              </div>
            </div>
          )}

          {tab === 'transactions' && (
            <div className="flex-1 flex">
              <div className="w-full overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left text-xs">
                      <th>ID</th><th>Type</th><th>Ref</th><th>Amount</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mock.transactions.map(tx=> (
                      <tr key={tx.id} onClick={()=>setSelectedTx(tx)} className="border-t border-slate-800 hover:bg-slate-800 cursor-pointer">
                        <td className="py-2">{tx.id}</td>
                        <td className="py-2">{tx.type}</td>
                        <td className="py-2">{tx.method || '-'}</td>
                        <td className={`py-2 ${tx.amount>=0? 'text-emerald-300' : 'text-rose-300'}`}>{tx.amount>=0? '+' : ''}{tx.amount}</td>
                        <td className="py-2 text-xs">{tx.status}</td>
                        <td className="py-2 text-xs text-slate-400">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedTx && (
                <div className="w-96 bg-slate-800 p-3 rounded ml-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{selectedTx.id}</div>
                    <div className="text-xs text-slate-400">{selectedTx.status}</div>
                  </div>
                  <div className="text-sm text-slate-300 mt-2">Type: {selectedTx.type}</div>
                  <div className="text-sm text-slate-300 mt-1">Amount: {fmtMoney(selectedTx.amount)}</div>
                  <div className="text-sm text-slate-300 mt-1">Reference: {selectedTx.method}</div>
                  <div className="mt-4">
                    <button onClick={()=>setSelectedTx(null)} className="px-3 py-2 bg-slate-700 rounded">Close</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showDeposit && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={()=>setShowDeposit(false)} />
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 z-10 w-96">
              <div className="text-lg font-semibold">Deposit funds</div>
              <div className="text-sm text-slate-400 mt-1">Method: {methodDeposit}</div>
              <input type="number" value={amountDeposit} onChange={e=>setAmountDeposit(Number(e.target.value))} className="w-full bg-slate-800 p-2 rounded mt-3" />
              <div className="mt-4 flex gap-2">
                <button onClick={()=>{ setShowDeposit(false); }} className="px-3 py-2 bg-emerald-600 rounded">Confirm</button>
                <button onClick={()=>setShowDeposit(false)} className="px-3 py-2 bg-slate-800 rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showWithdraw && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={()=>setShowWithdraw(false)} />
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 z-10 w-96">
              <div className="text-lg font-semibold">Withdraw funds</div>
              <div className="text-sm text-slate-400 mt-1">Method: {methodWithdraw}</div>
              <input type="number" value={amountWithdraw} onChange={e=>setAmountWithdraw(Number(e.target.value))} className="w-full bg-slate-800 p-2 rounded mt-3" />
              <div className="mt-4 flex gap-2">
                <button onClick={()=>{ setShowWithdraw(false); }} className="px-3 py-2 bg-emerald-600 rounded">Confirm</button>
                <button onClick={()=>setShowWithdraw(false)} className="px-3 py-2 bg-slate-800 rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Withdrawals
  const WithdrawalsView = () => {
    const [amount, setAmount] = useState(500);
    const [method, setMethod] = useState('Bank');
    const [notes, setNotes] = useState('');

    return (
      <div className="h-full min-w-0 overflow-hidden p-4">
        <Header title="Withdrawals" subtitle="Request fund withdrawal" Icon={Wallet} />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded p-4">
            <div className="text-sm text-slate-400">Amount</div>
            <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-48 bg-slate-800 p-2 rounded mt-1" />
            <div className="text-sm text-slate-400 mt-3">Destination</div>
            <select value={method} onChange={e=>setMethod(e.target.value)} className="bg-slate-800 p-2 rounded mt-1 w-48">
              <option>Bank</option>
              <option>Crypto</option>
              <option>Card</option>
            </select>
            <div className="mt-3 text-sm text-slate-400">Notes</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full bg-slate-800 p-2 rounded mt-1" rows={4} />
            <div className="mt-4"><button className="px-4 py-2 bg-emerald-600 rounded">Request Withdrawal</button></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <div className="text-sm text-slate-400">Fees</div>
            <div className="mt-1">Bank: $15, Crypto: 0.0005 BTC</div>
            <div className="text-sm text-slate-400 mt-3">Processing time</div>
            <div className="mt-1">Bank: 1-3 business days, Crypto: ~1 hour</div>
          </div>
        </div>

        <div className="mt-4 bg-slate-900 border border-slate-800 rounded p-3 overflow-auto" style={{minHeight:0, maxHeight:200}}>
          <div className="text-sm text-slate-400 mb-2">Withdrawal history</div>
          <table className="w-full text-sm">
            <tbody>
              {mock.funds.history.map(h=> (
                <tr key={h.id} className="border-t border-slate-700"><td className="py-2">{h.date}</td><td className="py-2">{fmtMoney(h.amount)}</td><td className="py-2">{h.method}</td><td className="py-2 text-xs">{h.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Transactions
  const TransactionsView = () => {
    const [selected, setSelected] = useState<any|null>(null);
    return (
      <div className="h-full min-w-0 overflow-hidden p-4">
        <Header title="Transactions" subtitle="Account activity and detailed ledger" Icon={List} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 h-[calc(100%-64px)] flex">
          <div className="w-full overflow-auto" style={{minHeight:0}}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left text-xs"><th>ID</th><th>Type</th><th>Ref</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {mock.transactions.map(tx=> (
                  <tr key={tx.id} onClick={()=>setSelected(tx)} className="border-t border-slate-800 hover:bg-slate-800 cursor-pointer">
                    <td className="py-2">{tx.id}</td>
                    <td className="py-2">{tx.type}</td>
                    <td className="py-2">{tx.method || '-'}</td>
                    <td className={`py-2 ${tx.amount>=0? 'text-emerald-300' : 'text-rose-300'}`}>{tx.amount>=0? '+' : ''}{tx.amount}</td>
                    <td className="py-2 text-xs">{tx.status}</td>
                    <td className="py-2 text-xs text-slate-400">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div className="w-96 bg-slate-800 p-3 rounded ml-3 overflow-auto" style={{minHeight:0}}>
              <div className="flex items-center justify-between"><div className="font-semibold">{selected.id}</div><div className="text-xs text-slate-400">{selected.status}</div></div>
              <div className="text-sm text-slate-300 mt-2">Type: {selected.type}</div>
              <div className="text-sm text-slate-300 mt-1">Amount: {fmtMoney(selected.amount)}</div>
              <div className="text-sm text-slate-300 mt-1">Reference: {selected.method}</div>
              <div className="mt-4"><button onClick={()=>setSelected(null)} className="px-3 py-2 bg-slate-700 rounded">Close</button></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Support
  const SupportView = () => {
    const [tickets, setTickets] = useState([
      { id: 'T-1', subject: 'Unable to withdraw', category: 'Withdrawals', status: 'Open', updated: '2025-12-22' },
      { id: 'T-2', subject: 'KYC address verification', category: 'Account', status: 'Closed', updated: '2025-12-10' }
    ]);
    const [openForm, setOpenForm] = useState(false);

    return (
      <div className="h-full min-w-0 overflow-hidden p-4">
        <Header title="Support" subtitle="Open tickets and customer help resources" Icon={Activity} />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-300">Tickets</div>
              <button onClick={()=>setOpenForm(true)} className="px-3 py-1 bg-emerald-600 rounded text-sm">Open new ticket</button>
            </div>
            <div className="overflow-auto" style={{minHeight:0, maxHeight:360}}>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-400 text-left text-xs"><th>Subject</th><th>Category</th><th>Status</th><th>Last update</th></tr></thead>
                <tbody>{tickets.map(t=> <tr key={t.id} className="border-t border-slate-800"><td className="py-2">{t.subject}</td><td className="py-2">{t.category}</td><td className="py-2">{t.status}</td><td className="py-2 text-xs">{t.updated}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-sm text-slate-300">Overview</div>
            <div className="mt-3">Open: <span className="font-medium">{tickets.filter(t=>t.status==='Open').length}</span></div>
            <div className="mt-2">Closed: <span className="font-medium">{tickets.filter(t=>t.status==='Closed').length}</span></div>
            <div className="mt-3 text-sm text-slate-400">Avg response time</div>
            <div className="mt-1">{Math.round(24)} hours</div>
          </div>
        </div>

        {openForm && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={()=>setOpenForm(false)} />
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 z-10 w-96">
              <div className="text-lg font-semibold">Open ticket</div>
              <div className="mt-2"><input placeholder="Subject" className="w-full bg-slate-800 p-2 rounded" /></div>
              <div className="mt-2"><select className="w-full bg-slate-800 p-2 rounded"><option>Account</option><option>Trading</option><option>Withdrawals</option></select></div>
              <div className="mt-2"><textarea placeholder="Message" className="w-full bg-slate-800 p-2 rounded" rows={4} /></div>
              <div className="mt-4 flex gap-2"><button onClick={()=>setOpenForm(false)} className="px-3 py-2 bg-emerald-600 rounded">Send</button><button onClick={()=>setOpenForm(false)} className="px-3 py-2 bg-slate-800 rounded">Cancel</button></div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-slate-900 border border-slate-800 rounded p-3">
          <div className="text-sm text-slate-300 mb-2">FAQ</div>
          <div className="space-y-2 text-sm">
            <details className="bg-slate-800 p-2 rounded"><summary className="cursor-pointer">How do I deposit funds?</summary><div className="mt-2 text-slate-400">Use the Deposits panel. Bank transfers appear in 1-3 business days.</div></details>
            <details className="bg-slate-800 p-2 rounded"><summary>How do I verify my address?</summary><div className="mt-2 text-slate-400">Upload a recent utility bill under Documents.</div></details>
            <details className="bg-slate-800 p-2 rounded"><summary>What are trading fees?</summary><div className="mt-2 text-slate-400">Fees are shown on the Trade ticket and in Transactions.</div></details>
            <details className="bg-slate-800 p-2 rounded"><summary>How long do withdrawals take?</summary><div className="mt-2 text-slate-400">Bank: 1-3 days, Crypto: ~1 hour.</div></details>
            <details className="bg-slate-800 p-2 rounded"><summary>Can I trade crypto 24/7?</summary><div className="mt-2 text-slate-400">Yes, markets marked Open are tradable.</div></details>
          </div>
        </div>
      </div>
    );
  };

  // choose view
  switch(page){
    case 'trade': return <TradePage />;
    case 'negotiate': return <TradePage />;
    case 'markets': return <MarketsView />;
    case 'open positions': return <OpenPositionsView />;
    case 'open-positions': return <OpenPositionsView />;
    case 'closed positions': return <ClosedPositionsView />;
    case 'closed-positions': return <ClosedPositionsView />;
    case 'funds': return <FundsView />;
    case 'withdrawals': return <WithdrawalsView />;
    case 'transactions': return <TransactionsView />;
    case 'support': return <SupportView />;
    case 'profile & kyc': return <ProfileView />;
    case 'profile': return <ProfileView />;
    default:
      return (
        <div className="h-full min-w-0 overflow-hidden p-4">
          <Header title={title || 'Page'} />
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 h-full">
            <div className="text-slate-300">Content implemented for this route.</div>
          </div>
        </div>
      );
  }
}

function ProfileView(){
  const user = mock.user;
  const docSummary = mock.documents.reduce((acc:any,d:any)=>{ acc[d.type] = (acc[d.type]||0)+1; return acc; }, {});

  return (
    <div className="h-full min-w-0 overflow-hidden p-4">
      <Header title="Account" subtitle="Manage your profile, documents, security and preferences" Icon={User} />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">Profile overview</div>
              <div className="text-xl font-semibold mt-1">{user.name} — {mock.accounts[0].id}</div>
              <div className="text-sm text-slate-400 mt-1">{user.location} • Risk profile: {user.risk}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-slate-800 rounded">Edit profile</button>
              <button className="px-3 py-2 bg-emerald-600 rounded text-black">Upgrade</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-xs text-slate-400">Personal information</div>
              <div className="mt-2 text-sm">Email: <span className="font-medium">user@example.com</span></div>
              <div className="text-sm">Phone: <span className="font-medium">+1 •••• 1234</span></div>
              <div className="text-sm">Address: <span className="font-medium">—</span></div>
            </div>
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-xs text-slate-400">Account balances</div>
              <div className="mt-2 text-lg font-semibold">${mock.kpis.inAccount.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Free margin: ${mock.kpis.freeMargin.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-3 bg-slate-800 p-3 rounded">
            <div className="text-sm font-semibold">Documents & KYC status</div>
            <div className="text-xs text-slate-400 mt-1">ID: {mock.user.kyc.idVerification} • Address: {mock.user.kyc.address}</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {mock.documents.map(d=> (
                <div key={d.id} className="bg-slate-900 p-2 rounded text-sm">
                  <div className="font-medium">{d.type}</div>
                  <div className="text-xs text-slate-400">{d.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{d.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 bg-slate-900 p-3 rounded">
            <div className="text-sm font-semibold">Statements & reports</div>
            <div className="text-xs text-slate-400 mt-1">Monthly statements, trade reports and tax documents are available here.</div>
            <div className="mt-3 space-y-2">
              <button className="px-3 py-2 bg-slate-800 rounded">Download monthly statement</button>
              <button className="px-3 py-2 bg-slate-800 rounded">Generate tax report</button>
            </div>
          </div>
        </div>

        <aside className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div>
            <div className="text-xs text-slate-400">Security</div>
            <div className="mt-2 text-sm">Password: <span className="font-medium">Last changed 2025-09-02</span></div>
            <div className="mt-1 text-sm">2FA: <span className="font-medium">Enabled</span></div>
            <div className="mt-3"><button className="px-3 py-2 bg-slate-800 rounded">Manage security</button></div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Preferences & notifications</div>
            <div className="mt-2 text-sm">Email alerts: <span className="font-medium">Enabled</span></div>
            <div className="mt-1 text-sm">Push notifications: <span className="font-medium">Disabled</span></div>
            <div className="mt-3"><button className="px-3 py-2 bg-slate-800 rounded">Edit preferences</button></div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Recent sessions</div>
            <div className="mt-2 text-sm">Active session: Chrome • US • 2025-12-24</div>
            <div className="text-sm mt-1">Last login: 2025-12-24 11:05</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
