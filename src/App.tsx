import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ComparePage } from './pages/ComparePage';
import { RegionsPage } from './pages/RegionsPage';
import { AccountPage } from './pages/AccountPage';
import { BottomNav } from './components/BottomNav/BottomNav';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:id" element={<DetailPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/comparar" element={<ComparePage />} />
        <Route path="/regioes" element={<RegionsPage />} />
        <Route path="/conta" element={<AccountPage />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}
