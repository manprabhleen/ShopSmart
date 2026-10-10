import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  RefreshCw,
  Zap
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function OrderTrackingModule({ latestOrderId }) {
  const [orderIdInput, setOrderIdInput] = useState(latestOrderId || 'ORD-2026-8941');
  
  // Demo Order States
  const [ordersMap, setOrdersMap] = useState({
    'ORD-2026-8941': {
      orderId: 'ORD-2026-8941',
      date: 'Oct 10, 2026 • 11:40 AM',
      status: 'IN_TRANSIT',
      currentStepIndex: 2,
      items: [
        { product: MOCK_PRODUCTS[0], quantity: 1 }
      ],
      totalAmount: 949,
      warehouse: 'East Coast Automated Fulfillment Hub #4 (New Jersey)',
      carrier: 'ShopSmart AI Autonomous Express Delivery',
      estimatedDelivery: 'Tomorrow, Oct 11 by 2:00 PM',
      timeline: [
        { title: 'Order Placed', subtitle: 'Customer checkout verified', time: '11:40 AM', done: true },
        { title: 'AI Warehouse Allocation', subtitle: 'Stock reserved at Hub #4', time: '11:43 AM', done: true },
        { title: 'Shipped from Distribution Hub', subtitle: 'Package handed to carrier', time: '12:15 PM', done: true },
        { title: 'In Transit to Local Hub', subtitle: 'On route via express logistics', time: 'Estimated 4:30 PM', done: false },
        { title: 'Out for Final Delivery', subtitle: 'Delivered to customer doorstep', time: 'Pending', done: false }
      ],
      auditLogs: [
        { time: '11:40:02 AM', message: 'Order created via ShopSmart Web App' },
        { time: '11:43:15 AM', message: 'AI Inventory Agent assigned serial #DEL-8941-NJ' },
        { time: '12:15:00 PM', message: 'Automated sorting arm packaged item with protective eco-foam' }
      ]
    },
    'ORD-2026-3412': {
      orderId: 'ORD-2026-3412',
      date: 'Oct 09, 2026 • 04:15 PM',
      status: 'DELIVERED',
      currentStepIndex: 4,
      items: [
        { product: MOCK_PRODUCTS[4], quantity: 1 }
      ],
      totalAmount: 349,
      warehouse: 'West Coast Automated Hub #2 (California)',
      carrier: 'ShopSmart AI Express Logistics',
      estimatedDelivery: 'Delivered Oct 10',
      timeline: [
        { title: 'Order Placed', subtitle: 'Verified', time: '04:15 PM', done: true },
        { title: 'AI Warehouse Allocation', subtitle: 'Hub #2 Allocated', time: '04:18 PM', done: true },
        { title: 'Shipped from Hub', subtitle: 'In transit', time: '06:00 PM', done: true },
        { title: 'Local Sorting Center', subtitle: 'Arrived at hub', time: '08:30 AM', done: true },
        { title: 'Delivered to Doorstep', subtitle: 'Handed to recipient', time: '10:15 AM', done: true }
      ],
      auditLogs: [
        { time: '04:15:00 PM', message: 'Order placed by Alex Johnson' },
        { time: '10:15:22 AM', message: 'Proof of delivery photo captured by driver agent' }
      ]
    }
  });

  const activeOrder = ordersMap[orderIdInput] || ordersMap['ORD-2026-8941'];

  const handleSearch = () => {
    if (!orderIdInput.trim()) return;
    if (!ordersMap[orderIdInput]) {
      // Generate dynamically if unknown order ID
      const dynamicOrd = {
        orderId: orderIdInput,
        date: 'Just now',
        status: 'PROCESSING',
        currentStepIndex: 1,
        items: [{ product: MOCK_PRODUCTS[1], quantity: 1 }],
        totalAmount: 1099,
        warehouse: 'Central Fulfillment Hub #1',
        carrier: 'ShopSmart Express Logistics',
        estimatedDelivery: 'Oct 12, 2026',
        timeline: [
          { title: 'Order Placed', subtitle: 'Verified', time: 'Just now', done: true },
          { title: 'AI Warehouse Allocation', subtitle: 'Assigning stock', time: 'In progress', done: true },
          { title: 'Shipped from Hub', subtitle: 'Pending packaging', time: 'Pending', done: false },
          { title: 'In Transit', subtitle: 'Pending dispatch', time: 'Pending', done: false },
          { title: 'Delivered', subtitle: 'Pending delivery', time: 'Pending', done: false }
        ],
        auditLogs: [
          { time: 'Just now', message: `Order ${orderIdInput} created in system` }
        ]
      };
      setOrdersMap((prev) => ({ ...prev, [orderIdInput]: dynamicOrd }));
    }
  };

  const handleAdvanceStep = () => {
    setOrdersMap((prev) => {
      const current = prev[activeOrder.orderId];
      if (!current) return prev;

      const nextIdx = Math.min(current.currentStepIndex + 1, current.timeline.length - 1);
      const updatedTimeline = current.timeline.map((st, i) => ({
        ...st,
        done: i <= nextIdx
      }));

      const newStatus = nextIdx === current.timeline.length - 1 ? 'DELIVERED' : 'IN_TRANSIT';

      return {
        ...prev,
        [activeOrder.orderId]: {
          ...current,
          currentStepIndex: nextIdx,
          status: newStatus,
          timeline: updatedTimeline,
          auditLogs: [
            ...current.auditLogs,
            { time: 'Just now', message: `Order advanced to step ${nextIdx + 1}: ${updatedTimeline[nextIdx].title}` }
          ]
        }
      };
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
            <Truck className="w-4 h-4 text-indigo-400" /> Operations & Order Logistics • Module 4
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Autonomous Order Fulfillment & Real-Time Stepper
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Track real-time warehouse dispatch, automated inventory allocation, carrier handoffs, and estimated delivery timelines.
          </p>
        </div>
      </div>

      {/* Order Search & Demo Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter Order ID (e.g. ORD-2026-8941)..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Search className="w-4 h-4" /> Track Order
          </button>
        </div>

        {/* Quick Demo Switcher Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400">Quick Demo Orders:</span>
          {Object.keys(ordersMap).map((id) => (
            <button
              key={id}
              onClick={() => setOrderIdInput(id)}
              className={`text-[11px] font-mono font-bold px-3 py-1 rounded-lg border transition-all ${
                orderIdInput === id
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Active Order Stepper Card */}
      {activeOrder && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          {/* Status Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tracking Order ID
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xl font-mono font-extrabold text-white">{activeOrder.orderId}</span>
                <span className="text-xs text-slate-400 font-mono">({activeOrder.date})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border shadow-sm ${
                activeOrder.status === 'DELIVERED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                ● Status: {activeOrder.status}
              </span>

              {/* Advance Order Button (Demo Power Tool) */}
              <button
                onClick={handleAdvanceStep}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                title="Simulate advancing to next logistics step"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Simulate Next Step</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline Visualizer */}
          <div className="py-6 px-2">
            <div className="relative flex items-center justify-between">
              {/* Timeline Connector Line */}
              <div className="absolute top-4 left-6 right-6 h-1 bg-slate-800 -z-0" />
              <div
                className="absolute top-4 left-6 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 transition-all duration-500 -z-0"
                style={{
                  width: `${(activeOrder.currentStepIndex / (activeOrder.timeline.length - 1)) * 92}%`
                }}
              />

              {activeOrder.timeline.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center space-y-2 text-center group">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      step.done
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-500/30'
                        : idx === activeOrder.currentStepIndex
                        ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-500/30'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {step.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-100 block max-w-[100px] leading-tight">
                      {step.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch Warehouse & Carrier Info */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-400" /> Dispatch Warehouse Location
              </span>
              <p className="font-bold text-slate-200">{activeOrder.warehouse}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" /> Carrier & Est. Delivery
              </span>
              <p className="font-bold text-slate-200">{activeOrder.carrier}</p>
              <p className="text-[11px] font-mono text-emerald-400">{activeOrder.estimatedDelivery}</p>
            </div>
          </div>

          {/* Itemized Package List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" /> Package Contents ({activeOrder.items.length} items)
            </h4>

            <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800">
              {activeOrder.items.map((it, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-800 shrink-0"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-slate-100">{it.product.name}</h5>
                      <span className="text-[10px] font-mono text-slate-400">Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-slate-200 text-xs">${it.product.price * it.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Logistics Audit Log */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> AI Agent Logistics Audit Log
            </h4>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
              {activeOrder.auditLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">[{log.time}]</span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
