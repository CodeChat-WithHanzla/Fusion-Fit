import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ContentArea from '../components/admin/ContentArea';
import Dashboard from './admin/Dashboard';
import OrderManagement from './admin/OrderManagement';
import ProductManagement from './admin/ProductManagement';
import EditProduct from '../components/admin/product/EditProduct';

const Admin = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <ContentArea>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="/product/edit/:id" element={<EditProduct /> } />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </ContentArea>
        </div>
    );
};

export default Admin;
