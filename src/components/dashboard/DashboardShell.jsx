
import React, { useState } from 'react'
import mock from '../../mock/userDashboardMock'
import TradePanel from './panels/TradePanel'
import PositionsPanel from './panels/PositionsPanel'
import FundsPanel from './panels/FundsPanel'
import TransactionsPanel from './panels/TransactionsPanel'
import DocumentsPanel from './panels/DocumentsPanel'
import StatementsPanel from './panels/StatementsPanel'
import MarketsPanel from './panels/MarketsPanel.fixed'
import NotificationsPanel from '../ui/NotificationsPanel'
import Modal from './Modal'
import Drawer from './Drawer'
import TransactionsList from './TransactionsList'
import QuickActions from './QuickActions.fixed'

export default function DashboardShell(){
  const [modal, setModal] = useState({ open:false, type:null, payload:null })
  const [drawer, setDrawer] = useState({ open:false, payload:null })
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notifications = mock.notifications || []

  function openModal(type, payload){ setModal({ open:true, type, payload: payload || null }) }
  function closeModal(){ setModal({ open:false, type:null, payload:null }) }

  function openDrawer(payload){ setDrawer({ open:true, payload }) }

  const onQuickAction = (id)=>{
    if(id === 'settings'){ openModal('settings') }
    else openModal(id)
  }

  const renderMain = ()=>{
    // default dashboard main content; navigation handled by AppShell
    return <TradePanel accounts={mock.accounts} onPlaceOrder={(o)=>{ alert('Order placed (mock)'); console.log(o); }} />
  }

  return (
    <div className="h-full min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 h-full" style={{minHeight:0}}>
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-lg p-3">Account ID: {mock.user.id}</div>
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-3">In account: ${mock.accounts[0].balance.toLocaleString()}</div>
        </div>

        <div className="flex gap-4 flex-1 min-w-0" style={{minHeight:0}}>
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {renderMain()}
          </div>

          <div className="w-96 flex flex-col gap-4 min-w-0">
            <div className="h-64">
              <MarketsPanel markets={mock.markets} onTrade={(m,side,price)=>openModal('trade',{...m,side,price})} onAction={(type,payload)=>openModal(type,payload)} />
            </div>
            <TransactionsList items={mock.transactions} onRowClick={t=>openDrawer({type:'tx', item:t})} />
            <QuickActions onAction={onQuickAction} />
          </div>
        </div>

      </div>

      <Modal open={modal.open} title={modal.type ? modal.type.toUpperCase() : ''} onClose={closeModal}>
        {modal.type === 'trade' && modal.payload && (
          <div>
            <div className="mb-2">Trade (mock)</div>
            <div className="mb-2">{modal.payload.symbol} — {modal.payload.side.toUpperCase()} @ {modal.payload.price}</div>
            <button onClick={()=>{ alert(`Executed ${modal.payload.side} ${modal.payload.symbol} @ ${modal.payload.price} (mock)`); closeModal(); }} className="px-3 py-2 bg-emerald-600 rounded">Confirm</button>
          </div>
        )}
        {modal.type === 'deposit' && <div>
          <div className="mb-2">Deposit (mock)</div>
          <button onClick={()=>{ alert('Deposit simulated'); closeModal(); }} className="px-3 py-2 bg-emerald-600 rounded">Confirm</button>
        </div>}
        {modal.type === 'withdraw' && <div>
          <div className="mb-2">Withdraw (mock)</div>
          <button onClick={()=>{ alert('Withdraw simulated'); closeModal(); }} className="px-3 py-2 bg-rose-600 rounded">Confirm</button>
        </div>}
        {modal.type === 'transfer' && <div>
          <div className="mb-2">Transfer (mock)</div>
          <button onClick={()=>{ alert('Transfer simulated'); closeModal(); }} className="px-3 py-2 bg-emerald-600 rounded">Confirm</button>
        </div>}
        {modal.type === 'insights' && modal.payload && (
          <div>
            <div className="text-slate-100 font-semibold mb-2">Insights for {modal.payload.symbol}</div>
            <div className="text-slate-400 text-sm">(Mock insights content)</div>
          </div>
        )}
        {modal.type === 'alert' && modal.payload && (
          <div>
            <div className="mb-2">Set price alert for {modal.payload.symbol} (mock)</div>
            <button onClick={()=>{ alert('Alert set (mock)'); closeModal(); }} className="px-3 py-2 bg-emerald-600 rounded">Set alert</button>
          </div>
        )}
      </Modal>

      <Drawer open={drawer.open} onClose={() => setDrawer({ open:false, payload:null })}>
        {drawer.payload && drawer.payload.type === 'tx' && (
          <div>
            <div className="text-slate-100 font-semibold mb-2">Transaction {drawer.payload.item.id}</div>
            <div className="text-slate-400 text-sm mb-2">{drawer.payload.item.type} • {drawer.payload.item.date}</div>
            <div className="mb-2">Amount: <span className={`font-semibold ${drawer.payload.item.amount>=0? 'text-emerald-400':'text-rose-400'}`}>${Math.abs(drawer.payload.item.amount)}</span></div>
            <div className="text-slate-400 text-sm">Status: {drawer.payload.item.status}</div>
          </div>
        )}

        {drawer.payload && drawer.payload.type === 'position' && (
          <div>
            <div className="text-slate-100 font-semibold mb-2">Position {drawer.payload.item.id}</div>
            <div className="text-slate-400 text-sm mb-2">{drawer.payload.item.symbol} • {drawer.payload.item.side}</div>
            <div className="mb-2">Size: {drawer.payload.item.size}</div>
            <div className={`mb-2 font-semibold ${drawer.payload.item.pnl>=0? 'text-emerald-400':'text-rose-400'}`}>P/L: ${drawer.payload.item.pnl}</div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
