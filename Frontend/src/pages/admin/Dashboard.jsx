import React from 'react';
import { useEffect, useState } from 'react';
import { Package, ShoppingCart, AlertCircle, CheckCircle, DollarSign, Box, AlertTriangle, BarChart } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : null;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('http://localhost:7000/api/admin/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStats(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, description, colorClass }) => (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {description && (
                <p className="text-xs text-gray-600 mt-2">{description}</p>
            )}
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="mb-8">
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-full max-w-md bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <LoadingSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    colorClass="text-blue-600"
                />
                <StatCard 
                    title="Orders This Month"
                    value={stats.ordersThisMonth}
                    icon={BarChart}
                    colorClass="text-green-600"
                />
                <StatCard 
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={AlertCircle}
                    colorClass="text-yellow-600"
                />
                <StatCard 
                    title="Completed Orders"
                    value={stats.completedOrders}
                    icon={CheckCircle}
                    colorClass="text-green-600"
                />
                <StatCard 
                    title="Revenue This Month"
                    value={`Rs. ${stats.revenueThisMonth}`}
                    icon={DollarSign}
                    description="Total earnings for current month"
                    colorClass="text-emerald-600"
                />
                <StatCard 
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    colorClass="text-purple-600"
                />
                <StatCard 
                    title="Out of Stock"
                    value={stats.outOfStockProducts}
                    icon={AlertTriangle}
                    description="Products requiring immediate attention"
                    colorClass="text-red-600"
                />
                <StatCard 
                    title="Low Stock"
                    value={stats.lowStockProducts}
                    icon={Box}
                    description="Products below minimum threshold"
                    colorClass="text-orange-600"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;