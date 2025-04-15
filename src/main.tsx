import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import './globals.css';
import { ThemeProvider } from './components/ThemeProvider';
import { NavigationBar } from './components/NavigationBar';
import SpotifyCallback from '@/pages/SpotifyCallback';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<SpotifyCallback />} path="/spotify/callback" />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
