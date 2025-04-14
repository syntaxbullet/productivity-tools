import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import './globals.css';
import { ThemeProvider } from './components/ThemeProvider';
import { NavigationBar } from './components/NavigationBar';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route element={<Home />} path="/" />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
