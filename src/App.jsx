import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LeftBar from './components/LeftBar';
import MainContent from './components/MainContent';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Login from './pages/Login';

// Simple auth check (token in localStorage)
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// PrivateRoute wrapper
function PrivateRoute({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <div className="flex h-screen overflow-hidden">
                <LeftBar />
                <div className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<MainContent />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/categories" element={<Categories />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;