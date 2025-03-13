import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Auth/LoginPage';
import RegisterPage from './Pages/Auth/RegisterPage';
import HomePage from './Pages/Home/HomePage';
import TripsPage from './Pages/Trips/TripsPage';
import TripDetailPage from './Pages/Trips/TripDetailPage';
import CheckoutPage from './Pages/Checkout/CheckoutPage';
import PaymentSuccessPage from './Pages/Checkout/PaymentSuccessPage';
import PaymentFailurePage from './Pages/Checkout/PaymentFailurePage';
import MyTicketsPage from './Pages/Tickets/MyTicketsPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminBuses from './Pages/Admin/AdminBuses';
import AdminRoutes from './Pages/Admin/AdminRoutes';
import AdminTickets from './Pages/Admin/AdminTickets';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/trips" element={<PrivateRoute><TripsPage /></PrivateRoute>} />
        <Route path="/trips/:id" element={<PrivateRoute><TripDetailPage /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="/checkout/success" element={<PrivateRoute><PaymentSuccessPage /></PrivateRoute>} />
        <Route path="/checkout/failure" element={<PrivateRoute><PaymentFailurePage /></PrivateRoute>} />
        <Route path="/my-tickets" element={<PrivateRoute><MyTicketsPage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/buses" element={<AdminRoute><AdminBuses /></AdminRoute>} />
        <Route path="/admin/routes" element={<AdminRoute><AdminRoutes /></AdminRoute>} />
        <Route path="/admin/tickets" element={<AdminRoute><AdminTickets /></AdminRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;