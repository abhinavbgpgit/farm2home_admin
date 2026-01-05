import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LeftBar from './components/LeftBar';
import MainContent from './components/MainContent';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;