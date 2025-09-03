import React, { useState, useCallback, useEffect, FC } from 'react';
import { DollarSign, ShoppingCart, Users, UserPlus, BarChart2, Star } from 'lucide-react';

// Define interfaces for the data structures
interface SaleData {
    _id: string; // Date string
    totalOrders: number;
    totalRevenue: number;
}

interface TopProduct {
    _id: string;
    title: string;
    saleCount: number;
}

interface UserStats {
    totalUsers: number;
    newUsersLast30Days: number;
}

// Reusable component for a single statistic card
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
        <div className="bg-amber-100 text-amber-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);


// Main Analytics Page Component
const AnalyticsPage: FC = () => {
    const [authToken, setAuthToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    
    // State to hold the fetched data
    const [salesData, setSalesData] = useState<SaleData[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    const BASE_URL = 'http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/admin/reports';

    useEffect(() => {
        const storedCredentials = localStorage.getItem('userCredentials');
        if (storedCredentials) {
            setAuthToken(JSON.parse(storedCredentials).token);
        } else {
            setLoading(false);
            setError("Authentication token not found. Please log in.");
        }
    }, []);

    const fetchAnalyticsData = useCallback(async (token: string) => {
        setLoading(true);
        setError(null);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch all three endpoints concurrently
            const [salesResponse, productsResponse, usersResponse] = await Promise.all([
                fetch(`${BASE_URL}/sales`, { headers }),
                fetch(`${BASE_URL}/products`, { headers }),
                fetch(`${BASE_URL}/users`, { headers }),
            ]);

            if (!salesResponse.ok) throw new Error('Failed to fetch sales data');
            if (!productsResponse.ok) throw new Error('Failed to fetch top products');
            if (!usersResponse.ok) throw new Error('Failed to fetch user stats');

            const salesJson = await salesResponse.json();
            const productsJson = await productsResponse.json();
            const usersJson = await usersResponse.json();

            setSalesData(salesJson.sales || []);
            setTopProducts(productsJson.topProducts || []);
            setUserStats({
                totalUsers: usersJson.totalUsers,
                newUsersLast30Days: usersJson.newUsersLast30Days
            });

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            console.error("Error fetching analytics data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authToken) {
            fetchAnalyticsData(authToken);
        }
    }, [authToken, fetchAnalyticsData]);

    if (loading) {
        return (
            <div className="space-y-6 p-6 bg-gray-100 min-h-screen flex justify-center items-center">
                <div className="text-gray-600">Loading Analytics...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="space-y-6 p-6 bg-gray-100 min-h-screen flex justify-center items-center">
                <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            
            {/* User Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={userStats?.totalUsers ?? 'N/A'} icon={<Users className="h-6 w-6" />} />
                <StatCard title="New Users (30 Days)" value={userStats?.newUsersLast30Days ?? 'N/A'} icon={<UserPlus className="h-6 w-6" />} />
                <StatCard title="Total Revenue" value={`₹${(salesData.reduce((acc, sale) => acc + sale.totalRevenue, 0)).toLocaleString('en-IN')}`} icon={<DollarSign className="h-6 w-6" />} />
                 <StatCard title="Total Orders" value={salesData.reduce((acc, sale) => acc + sale.totalOrders, 0)} icon={<ShoppingCart className="h-6 w-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Report Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <BarChart2 className="h-5 w-5 mr-2 text-amber-600"/>
                            Daily Sales Report
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Total Orders</th>
                                        <th scope="col" className="px-6 py-3">Total Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesData.length > 0 ? salesData.map((sale) => (
                                        <tr key={sale._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {new Date(sale._id).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">{sale.totalOrders}</td>
                                            <td className="px-6 py-4">₹{sale.totalRevenue.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="text-center py-4">No sales data available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Top Products List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                             <Star className="h-5 w-5 mr-2 text-amber-600"/>
                            Top Selling Products
                        </h3>
                    </div>
                    <div className="p-4">
                       <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Product Title</th>
                                        <th scope="col" className="px-6 py-3">Sale Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.length > 0 ? topProducts.map((product) => (
                                        <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{product.title}</td>
                                            <td className="px-6 py-4">{product.saleCount}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={2} className="text-center py-4">No product data available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
