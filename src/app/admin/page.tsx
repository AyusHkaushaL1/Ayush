'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/Products';
import Orders from '@/components/Orders';
import Customers from '@/components/Customers';
import Inventory from '@/components/Inventory';
 import Settings from '@/components/Settings';
import Login from '@/components/Login';     

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'inventory':
        return <Inventory />;
       case 'settings':
         return <Settings />;
         case 'user':
         return <Login />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header 
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
        /> */}
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
