import React, { useContext } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileSpreadsheet, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useContext(PayrollContext);

  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Roster Directory', icon: Users },
    { id: 'payroll', label: 'Process Payroll', icon: CreditCard },
    { id: 'history', label: 'Payment History', icon: FileSpreadsheet },
    { id: 'settings', label: 'Config Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-symbol">Æ</div>
        <span className="logo-text">Apex Payroll</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar">HR</div>
        <div className="profile-info">
          <span className="profile-name">Sarah Ops</span>
          <span className="profile-role">People & Payroll</span>
        </div>
      </div>
    </aside>
  );
}
