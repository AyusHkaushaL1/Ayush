import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [orders] = useState([
    { id: '#NK001', customer: 'Priya Sharma', amount: '₹25,000', status: 'Delivered', date: '2024-01-15' },
    { id: '#NK002', customer: 'Rajesh Kumar', amount: '₹15,500', status: 'Processing', date: '2024-01-14' },
    { id: '#NK003', customer: 'Anita Patel', amount: '₹32,000', status: 'Shipped', date: '2024-01-13' },
    { id: '#NK004', customer: 'Vikram Singh', amount: '₹18,750', status: 'Pending', date: '2024-01-12' },
    { id: '#NK005', customer: 'Meera Reddy', amount: '₹42,000', status: 'Delivered', date: '2024-01-11' }
  ]);

  const [customers] = useState([
    'Priya Sharma',
    'Rajesh Kumar',
    'Anita Patel',
    'Vikram Singh',
    'Meera Reddy'
  ]);

  // Calculate unique customers from orders
  const uniqueCustomers = [...new Set(orders.map(order => order.customer))];
  const totalCustomers = Math.max(uniqueCustomers.length, customers.length);

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Products',
      value: '456',
      change: '+2.4%',
      changeType: 'positive',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Customers',
      value: totalCustomers.toString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-amber-500'
    }
  ];

  const lowStockItems = [
    { name: 'Gold Chain 22K', stock: 3, category: 'Chains' },
    { name: 'Diamond Earrings', stock: 1, category: 'Earrings' },
    { name: 'Silver Bracelet', stock: 2, category: 'Bracelets' },
    { name: 'Pearl Necklace', stock: 4, category: 'Necklaces' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
