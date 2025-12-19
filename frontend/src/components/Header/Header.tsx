import React from 'react';
import './Header.scss';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <span className="menu-text">Menu</span>
      </div>
      <div className="header-center">
        <div className="user-icon"></div>
        <span className="user-name">User Name</span>
      </div>
      <div className="header-right">
        <h1 className="header-title">Sales Report</h1>
      </div>
    </header>
  );
};

