import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { revenueData, topSkins, topDevices, mockOrders } from "@/data/adminData";

const statCards = [
  { title: "Total Revenue", value: "$34,900", change: "+12.5%", up: true, icon: DollarSign },
  { title: "Orders", value: "564", change: "+8.2%", up: true, icon: ShoppingBag },
  { title: "Customers", value: "1,247", change: "+15.3%", up: true, icon: Users },
  { title: "Avg. Order Value", value: "$61.88", change: "-2.4%", up: false, icon: TrendingUp },
];

const AdminAnalytics = () => {
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.title}</span>
              <stat.icon size={18} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.up ? "text-primary" : "text-destructive"}`}>
              {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {stat.change} from last month
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card p-6">
          <h2 className="font-display font-semibold mb-1">Revenue Overview</h2>
          <p className="text-sm text-muted-foreground mb-6">Monthly revenue for the last 6 months</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top skins */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="font-display font-semibold mb-1">Top Selling Skins</h2>
          <p className="text-sm text-muted-foreground mb-4">By units sold</p>
          <div className="space-y-4">
            {topSkins.map((skin, i) => (
              <div key={skin.name} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{skin.name}</p>
                  <p className="text-xs text-muted-foreground">{skin.sales} sold</p>
                </div>
                <span className="text-sm font-semibold">${skin.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="font-display font-semibold mb-1">Recent Orders</h2>
          <p className="text-sm text-muted-foreground mb-4">Latest incoming orders</p>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.id} · {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{order.total.toFixed(0)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top devices */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="font-display font-semibold mb-1">Popular Devices</h2>
          <p className="text-sm text-muted-foreground mb-4">Most ordered device models</p>
          <div className="space-y-4">
            {topDevices.map((device, i) => {
              const maxOrders = topDevices[0].orders;
              return (
                <div key={device.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{device.name}</span>
                    <span className="text-muted-foreground">{device.orders} orders</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(device.orders / maxOrders) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500",
    processing: "bg-blue-500/10 text-blue-500",
    shipped: "bg-purple-500/10 text-purple-500",
    delivered: "bg-primary/10 text-primary",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium capitalize ${styles[status] || ""}`}>
      {status}
    </span>
  );
};

export default AdminAnalytics;
