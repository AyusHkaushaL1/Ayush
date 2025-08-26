import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';

// Define the shape of the order data coming directly from the API
interface ApiOrder {
  order_code: string;
  user: {
    name: string;
  };
  total_amount: string; // The API sends this as a string
  order_status: string; // e.g., 'pending', 'delivered'
  created_at: string;
}

// Define the shape of the order data for use within our component
interface Order {
  id: string;
  customer: string;
  amount: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Pending' | 'Cancelled'; // Expanded to include Cancelled
  date: string;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  category: {
    name: string;
  };
}

const Dashboard: React.FC = () => {
  // --- State for Orders fetched from API ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // State for low stock items fetched from API
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Orders from API ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsOrdersLoading(true);
        setOrdersError(null);
        const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/admin/orders');
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }
        const result = await response.json();
        
        const rawOrders: ApiOrder[] = Array.isArray(result.data) ? result.data : [];

        // Helper to safely format the status string from the API
        const formatOrderStatus = (status: string): Order['status'] => {
          const capitalized = status.charAt(0).toUpperCase() + status.slice(1);
          const validStatuses: Order['status'][] = ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled'];
          if (validStatuses.includes(capitalized as Order['status'])) {
            return capitalized as Order['status'];
          }
          return 'Pending'; // Default status if API sends an unknown one
        };

        // Map API data to our component's Order type
        const formattedOrders = rawOrders.map((order): Order => ({
          id: order.order_code,
          customer: order.user.name,
          amount: `₹${new Intl.NumberFormat('en-IN').format(parseFloat(order.total_amount))}`,
          status: formatOrderStatus(order.order_status),
          date: new Date(order.created_at).toLocaleDateString('en-CA'), // 'en-CA' gives YYYY-MM-DD format
        }));
        
        setOrders(formattedOrders);

      } catch (err) {
        if (err instanceof Error) {
          setOrdersError(err.message);
        } else {
          setOrdersError('An unexpected error occurred while fetching orders.');
        }
      } finally {
        setIsOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array ensures this runs only once on component mount


  // --- Fetch Low Stock Items from API ---
  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/products');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const result = await response.json();
        
        const allProducts: Product[] = Array.isArray(result.data) ? result.data : [];

        const filteredItems = allProducts.filter(product => product.stock < 5);
        setLowStockItems(filteredItems);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);


  // Calculate unique customers from the fetched orders
  const totalCustomers = [...new Set(orders.map(order => order.customer))].length;

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,680', // This value is static as it's not available in the orders API
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(), // Now dynamic
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
      value: totalCustomers.toString(), // Now dynamic
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-amber-500'
    }
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800'; // Added style for Cancelled
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
            {isOrdersLoading ? (
              <p className="text-gray-500">Loading recent orders...</p>
            ) : ordersError ? (
              <p className="text-red-500">Error: {ordersError}</p>
            ) : orders.length > 0 ? (
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
            ) : (
              <p className="text-gray-500">No recent orders found.</p>
            )}
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
            {isLoading ? (
              <p className="text-gray-500">Loading stock levels...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : lowStockItems.length > 0 ? (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        {item.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-gray-500">All products have sufficient stock.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;