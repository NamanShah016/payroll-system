import React, { useContext } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { WigglingCards } from './WigglingCards';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Building,
  CheckCircle,
  AlertCircle,
  TrendingDown
} from 'lucide-react';

export default function Dashboard() {
  const { employees, payrolls, config, setActiveTab, setSelectedEmployee } = useContext(PayrollContext);

  // Active employees count
  const activeEmployees = employees.filter(emp => emp.status === 'Active');
  const activeCount = activeEmployees.length;

  // Calculate total monthly payroll cost of standard gross salaries
  const totalStandardGrossExpense = activeEmployees.reduce((acc, emp) => {
    const base = Number(emp.baseSalary || 0);
    const hra = Number(emp.hra || 0);
    const med = Number(emp.medicalAllowance || 0);
    const spec = Number(emp.specialAllowance || 0);
    return acc + base + hra + med + spec;
  }, 0);

  // Average net salary of processed payrolls (or active base standard)
  const averageBaseSalary = activeCount > 0 
    ? (activeEmployees.reduce((acc, emp) => acc + Number(emp.baseSalary || 0), 0) / activeCount) 
    : 0;

  // Group by department
  const deptCounts = activeEmployees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  // For charts - group processed payrolls by month-year
  const monthlyExpenses = payrolls.reduce((acc, p) => {
    const key = `${p.month} ${p.year}`;
    acc[key] = (acc[key] || 0) + p.netSalary;
    return acc;
  }, {});

  // Hardcoded historical chart fallback if no payrolls are processed yet
  const chartData = Object.keys(monthlyExpenses).length > 0 
    ? Object.keys(monthlyExpenses).map(key => ({ label: key, value: monthlyExpenses[key] })).slice(0, 5).reverse()
    : [
        { label: 'May 2026', value: 185000 },
        { label: 'Jun 2026', value: 198000 },
        { label: 'Jul 2026', value: 258000 }
      ];

  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  // Check current month (August 2026) payroll processing status
  const processedThisMonthIds = payrolls
    .filter(p => p.month === 'August' && p.year === '2026')
    .map(p => p.employeeId);
  const processedCount = processedThisMonthIds.length;
  const remainingCount = Math.max(0, activeCount - processedCount);

  // Recent payrolls processed
  const recentPayrolls = payrolls.slice(0, 5);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: config.currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <header className="no-print">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analytics & Status</span>
        <h1 style={{ marginTop: '0.25rem' }}>Overview Dashboard</h1>
        <p>Real-time expenditures, employee aggregates, and statutory calculations.</p>
      </header>

      {/* Metrics Cards Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }} className="no-print">
        
        <div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Roster</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{employees.length}</span>
            <span style={{ color: 'var(--success)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              <TrendingUp size={12} /> {activeCount} Active Members
            </span>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Monthly Base Payroll</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(totalStandardGrossExpense)}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Standard Gross Estimate</span>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={22} />
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Average Base Salary</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(averageBaseSalary)}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Per active employee</span>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#faf5ff', color: '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Aug 2026 Run Status</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{processedCount}/{activeCount} Run</span>
            {remainingCount > 0 ? (
              <span style={{ color: '#b45309', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                <AlertCircle size={12} /> {remainingCount} Pending runs
              </span>
            ) : (
              <span style={{ color: 'var(--success)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                <CheckCircle size={12} /> Complete for all active
              </span>
            )}
          </div>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: remainingCount > 0 ? '#fffbeb' : '#f0fdf4', 
            color: remainingCount > 0 ? '#b45309' : '#15803d', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <CheckCircle size={22} />
          </div>
        </div>

      </section>

      {/* Analytical Charts, Departments, and Spotlight Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }} className="no-print">
        
        {/* Left Side Column: Expense trend & Dept breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Payroll Expense Bar Chart */}
          <div className="premium-card">
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Net Payroll Expense Trends</h4>
            <div className="bar-chart-visual" style={{ height: '170px' }}>
              {chartData.map((d, index) => {
                const heightPct = (d.value / maxVal) * 80;
                return (
                  <div key={index} className="bar-column">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${heightPct}%` }}
                      data-value={formatCurrency(d.value)}
                    ></div>
                    <span className="bar-label">{d.label}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>Hover over the columns to view exact expenditures.</p>
          </div>

          {/* Department Breakdowns */}
          <div className="premium-card">
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} style={{ color: 'var(--secondary)' }} />
              <span>Departmental Allocation</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {Object.keys(deptCounts).map((dept, idx) => {
                const count = deptCounts[dept];
                const pct = (count / activeCount) * 100;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-primary)' }}>{dept}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} ({Math.round(pct)}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${pct}%`, 
                        background: idx % 3 === 0 ? 'var(--primary)' : idx % 3 === 1 ? 'var(--success)' : 'var(--accent)',
                        borderRadius: '10px' 
                      }}></div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(deptCounts).length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '1rem' }}>
                  No active employee records.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Column: Roster Spotlight (Wiggling cards) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', justifyContent: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Roster Spotlight</h3>
              <p style={{ fontSize: '0.825rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>Swipe or drag to inspect highlighted employee profiles.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', minHeight: '260px' }}>
              <WigglingCards employees={employees} onCardClick={setSelectedEmployee} />
            </div>
          </div>

        </div>

      </section>

      {/* Recent Activity Table */}
      <section className="premium-card no-print">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Payroll runs</h4>
          <button className="custom-btn custom-btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('history')}>
            View All payments
          </button>
        </div>

        {recentPayrolls.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Emp Code</th>
                  <th>Month/Year</th>
                  <th>Gross Earnings</th>
                  <th>Deductions</th>
                  <th>Net Paid</th>
                  <th>Run Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayrolls.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.employeeName}</td>
                    <td>{p.empCode}</td>
                    <td>{p.month} {p.year}</td>
                    <td>{formatCurrency(p.grossEarnings)}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 500 }}>{formatCurrency(p.deductions.total)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(p.netSalary)}</td>
                    <td>{p.processedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-tertiary)' }}>
            No payroll payments processed yet. Go to the "Process Payroll" page to run calculations.
          </div>
        )}
      </section>
    </div>
  );
}
