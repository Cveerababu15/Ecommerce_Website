import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/user/Home";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./utils/AdminRoute";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Orders from "./pages/user/Orders";
import Checkout from "./pages/user/Checkout";
import Cart from "./pages/user/Cart";
import Products from "./pages/user/Products";
import ProductDetails from "./pages/user/ProductDetails";
import Dashboard from "./pages/Admin/Dashboard";
import AddProduct from "./pages/Admin/AddProduct";
import ManageProducts from "./pages/Admin/ManageProducts";
import ManageOrders from "./pages/Admin/ManageOrders";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public & Customer Routes - Wrapped in MainLayout */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
              <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
              <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
              <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
              
              {/* Protected Customer Routes - Wrapped in MainLayout */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <MainLayout><Cart /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <MainLayout><Orders /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <MainLayout><Checkout /></MainLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes - EXCLUSIVELY explicitly Wrapped in AdminLayout instead of MainLayout! */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout><Dashboard /></AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/add-product" element={
                <AdminRoute>
                  <AdminLayout><AddProduct /></AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute>
                  <AdminLayout><ManageProducts /></AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminLayout><ManageOrders /></AdminLayout>
                </AdminRoute>
              } />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;