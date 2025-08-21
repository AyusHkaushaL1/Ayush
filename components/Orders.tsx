import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Truck, Package, CheckCircle, Plus, Check, X, Edit3 } from 'lucide-react';

// Interface for the simplified order list view
interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: string;
  items: number;
  paymentMethod: string;
}

const Orders: React.FC = () => {
  const [authToken, setAuthToken] = useState<string>('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [newStatusInput, setNewStatusInput] = useState('');
  const [isAddingNewStatus, setIsAddingNewStatus] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const apiListUrl = '/api/admin/orders';
  const apiStatusUpdateUrl = (orderId: string) => `/api/admin/orders/${orderId}/status`;

  const fetchOrders = useCallback(async () => {
    if (!authToken) {
      setIsLoading(false);
      setError("Authentication token not found. Please log in.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(apiListUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json' 
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const responseData = await response.json();
      
      const ordersArray: Order[] = responseData.orders.map((apiOrder: any) => ({
        id: apiOrder._id,
        customer: apiOrder.user?.name || 'N/A',
        email: apiOrder.user?.email || 'N/A',
        date: apiOrder.placedAt,
        total: apiOrder.totalAmount,
        status: apiOrder.status,
        items: apiOrder.items?.length || 0,
        paymentMethod: apiOrder.paymentInfo?.method || 'N/A'
      }));

      if (!Array.isArray(ordersArray)) {
        throw new Error("API response is not an array of orders. Please check the API documentation.");
      }

      setOrders(ordersArray);
      const uniqueStatuses = Array.from(new Set(ordersArray.map(order => order.status)));
      setAvailableStatuses(uniqueStatuses.filter(s => s));

    } catch (e) {
      setError("Failed to fetch orders: " + (e as Error).message);
      console.error("Fetching orders failed:", e);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  const updateOrderStatusOnApi = useCallback(async (orderId: string, newStatus: string) => {
    if (!authToken) {
      setError("Authentication token not found. Please log in.");
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(apiStatusUpdateUrl(orderId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

    } catch (e) {
      setError("Failed to update order status: " + (e as Error).message);
      console.error("Updating order status failed:", e);
    } finally {
      setUpdatingOrderId(null);
      setEditingStatus(null);
    }
  }, [orders, authToken]);

  useEffect(() => {
    try {
      const storedCredentials = localStorage.getItem('userCredentials');
      if (storedCredentials) {
        const { token } = JSON.parse(storedCredentials);
        setAuthToken(token);
      } else {
        setError("No authentication token found. Please log in.");
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Failed to parse user credentials from localStorage');
      setError("Failed to retrieve authentication token from storage.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchOrders();
    }
  }, [authToken, fetchOrders]);
 
  const allStatuses = ['All', ...availableStatuses];

  const addNewStatus = (orderId: string, newStatus: string) => {
    if (newStatus.trim() && !availableStatuses.includes(newStatus.trim())) {
      const trimmedStatus = newStatus.trim();
      setAvailableStatuses([...availableStatuses, trimmedStatus]);
      updateOrderStatusOnApi(orderId, trimmedStatus);
    }
    setIsAddingNewStatus(null);
    setNewStatusInput('');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'placed': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      default: return null;
    }
  };

  const getOrderCounts = () => {
    return {
      total: orders.length,
      processing: orders.filter(o => o.status?.toLowerCase() === 'processing').length,
      shipped: orders.filter(o => o.status?.toLowerCase() === 'shipped').length,
      delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
      pending: orders.filter(o => o.status?.toLowerCase() === 'pending').length
    };
  };

  const counts = getOrderCounts();

  const StatusDropdown = ({ order }: { order: Order }) => {
    const isEditing = editingStatus === order.id;
    const isAddingNew = isAddingNewStatus === order.id;
    const isUpdating = updatingOrderId === order.id;

    if (isAddingNew) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newStatusInput}
            onChange={(e) => setNewStatusInput(e.target.value)}
            placeholder="Enter new status"
            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-32"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addNewStatus(order.id, newStatusInput);
              } else if (e.key === 'Escape') {
                setIsAddingNewStatus(null);
              }
            }}
            autoFocus
          />
          <button
            onClick={() => addNewStatus(order.id, newStatusInput)}
            className="p-1 text-green-600 hover:text-green-700"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setIsAddingNewStatus(null);
              setNewStatusInput('');
            }}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    if (isEditing) {
      return (
        <select
          value={order.status}
          onChange={(e) => {
            if (e.target.value === '__ADD_NEW__') {
              setIsAddingNewStatus(order.id);
              setEditingStatus(null);
            } else {
              updateOrderStatusOnApi(order.id, e.target.value);
              setEditingStatus(null);
            }
          }}
          onBlur={() => setEditingStatus(null)}
          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          autoFocus
        >
          {availableStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
          <option value="__ADD_NEW__" className="text-amber-600 font-medium">
            + Add New Status
          </option>
        </select>
      );
    }
    
    if (isUpdating) {
        return (
            <div className="flex items-center">
                <span className="animate-pulse text-gray-500">Updating...</span>
            </div>
        );
    }

    return (
      <div className="relative group">
        <button
          onClick={() => setEditingStatus(order.id)}
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)} hover:opacity-80 hover:shadow-md transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-amber-200`}
        >
          {getStatusIcon(order.status)}
          <span className="ml-1">{order.status}</span>
          <Edit3 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-70 transition-opacity duration-200" />
        </button>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Click to edit status
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
{/*       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div> */}

{/* Page Header */}
<div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
</div>

{/* Order Stats */}
<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Orders</p>
        <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
      </div>
      <div className="bg-blue-100 p-3 rounded-full">
        <Package className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Pending</p>
        <p className="text-2xl font-bold text-gray-900">{counts.pending}</p>
      </div>
      <div className="bg-yellow-100 p-3 rounded-full">
        <Package className="h-6 w-6 text-yellow-600" />
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Processing</p>
        <p className="text-2xl font-bold text-gray-900">{counts.processing}</p>
      </div>
      <div className="bg-blue-100 p-3 rounded-full">
        <Package className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Shipped</p>
        <p className="text-2xl font-bold text-gray-900">{counts.shipped}</p>
      </div>
      <div className="bg-purple-100 p-3 rounded-full">
        <Truck className="h-6 w-6 text-purple-600" />
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Delivered</p>
        <p className="text-2xl font-bold text-gray-900">{counts.delivered}</p>
      </div>
      <div className="bg-green-100 p-3 rounded-full">
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>
    </div>
  </div>
</div>


{/* Filters */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full sm:w-64"
        />
      </div>
      
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full sm:w-auto"
      >
        {allStatuses.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>

    <div className="flex items-center space-x-2">
      <Filter className="h-5 w-5 text-gray-400" />
      <span className="text-sm text-gray-600">
        Showing {filteredOrders.length} of {orders.length} orders
      </span>
    </div>
  </div>
</div>


{/* Orders Table */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  <div className="overflow-x-auto">
    {/* prettier-ignore */}
    <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><div className="flex items-center space-x-1"><span>Status</span><Edit3 className="h-3 w-3 text-gray-400" /><span className="text-xs normal-case text-gray-400">(Click to edit)</span></div></th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{filteredOrders.map((order) => (<tr key={order.id} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{order.id}</div></td><td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{order.customer}</div><div className="text-sm text-gray-500">{order.email}</div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.date).toLocaleDateString('en-IN')}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.items}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total.toLocaleString('en-IN')}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.paymentMethod}</td><td className="px-6 py-4 whitespace-nowrap"><StatusDropdown order={order} /></td></tr>))}</tbody></table>
  </div>
</div>

    </div>
  );
};

export default Orders;