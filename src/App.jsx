import React, { useContext } from 'react';
import { PayrollProvider, PayrollContext } from './context/PayrollContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeDirectory from './components/EmployeeDirectory';
import PayrollProcessor from './components/PayrollProcessor';
import PayrollHistory from './components/PayrollHistory';
import Settings from './components/Settings';
import ProfileDetails from './components/ProfileDetails';
import PayslipView from './components/PayslipView';

function AppContent() {
  const { activeTab } = useContext(PayrollContext);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'directory':
        return <EmployeeDirectory />;
      case 'payroll':
        return <PayrollProcessor />;
      case 'history':
        return <PayrollHistory />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {renderContent()}
      </main>
      <ProfileDetails />
      <PayslipView />
    </div>
  );
}

export default function App() {
  return (
    <PayrollProvider>
      <AppContent />
    </PayrollProvider>
  );
}
