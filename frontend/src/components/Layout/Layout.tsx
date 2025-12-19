import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../Header/Header';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      <Header />
      <nav className="navigation">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/categories" 
          className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
        >
          Categories
        </Link>
        <Link 
          to="/products" 
          className={`nav-link ${isActive('/products') ? 'active' : ''}`}
        >
          Products
        </Link>
        <Link 
          to="/brands" 
          className={`nav-link ${isActive('/brands') ? 'active' : ''}`}
        >
          Brands
        </Link>
        <Link 
          to="/sales" 
          className={`nav-link ${isActive('/sales') ? 'active' : ''}`}
        >
          Sales
        </Link>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

