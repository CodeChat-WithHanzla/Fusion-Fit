import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Home from './pages/Home';
import Admin from './pages/Admin';
import PrivateRoute from './middlewares/PrivateRoute';
import AuthRedirect from './middlewares/AuthRedirect';
import VerifyEmail from './pages/auth/VerifyEmail';
import { Toaster } from "react-hot-toast";
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favourites from './pages/Favourites';
import SearchResults from './pages/SearchResult';
import CheckoutPage from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrdersPage from './pages/MyOrders';
import MeasurementPage from './pages/Measurement';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <Toaster />
        <div className="flex-grow">
          <Routes>
            <Route path="/signup" element={<AuthRedirect><SignUp /></AuthRedirect>} />
            <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
            <Route path="/forgot-password" element={<AuthRedirect><ForgotPassword /></AuthRedirect>} />
            <Route path="/reset-password/:token" element={<AuthRedirect><ResetPassword /> </AuthRedirect>} />
            <Route path="/verify-email/:token" element={<AuthRedirect><VerifyEmail /></AuthRedirect>} />
            <Route path="/" element={<PrivateRoute allowedRoles={['customer']}><Home /></PrivateRoute>} />
            <Route path="/measure" element={<MeasurementPage />} />
            <Route path="/product/:id" element={< ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/admin/*" element={<PrivateRoute allowedRoles={['admin']}><Admin /></PrivateRoute>} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  )
}

export default App
