import React, { useContext, useState } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { 
  Search, 
  Trash2, 
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base-ui/avatar';

export default function PayrollHistory() {
  const { payrolls, config, deletePayrollRecord, setSelectedPayslip, setActiveTab } = useContext(PayrollContext);
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Extract unique months and years from history
  const historyMonths = [...new Set(payrolls.map(p => p.month))];
  const historyYears = [...new Set(payrolls.map(p => p.year))];

  // Filter payroll records
  const filteredHistory = payrolls.filter(p => {
    const matchesSearch = p.employeeName.toLowerCase().includes(search.toLowerCase()) || 
                          p.empCode.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = monthFilter ? p.month === monthFilter : true;
    const matchesYear = yearFilter ? p.year === yearFilter : true;
    return matchesSearch && matchesMonth && matchesYear;
  });

  const handleDelete = (id, name, period) => {
    if (window.confirm(`Are you sure you want to delete the payroll ledger record for ${name} during ${period}? This action is irreversible.`)) {
      deletePayrollRecord(id);
    }
  };

  const handleViewPayslip = (p) => {
    setSelectedPayslip(p);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: config.currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const getDeptColor = (dept) => {
    const d = dept ? dept.toLowerCase() : '';
    if (d.includes('eng')) return '#1e40af';
    if (d.includes('design')) return '#c2410c';
    if (d.includes('prod')) return '#6b21a8';
    if (d.includes('hr')) return '#0d9488';
    return '#475569';
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <header className="no-print">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Auditing Ledger</span>
        <h1 style={{ marginTop: '0.25rem' }}>Payment History</h1>
        <p>Browse historical salary payout entries, audit statutory values, and inspect generated payslips.</p>
      </header>

      {/* Filter panel */}
      <section className="premium-card no-print" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
        <div className="custom-search" style={{ maxWidth: '340px', flex: 1 }}>
          <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            placeholder="Search employee name or code..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <select 
            className="custom-select"
            style={{ width: '160px' }} 
            value={monthFilter} 
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">All Months</option>
            {historyMonths.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>

          <select 
            className="custom-select"
            style={{ width: '130px' }}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {historyYears.map((y, idx) => (
              <option key={idx} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </section>

      {/* History Ledger Table */}
      <section className="premium-card no-print">
        {filteredHistory.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Name & Role</th>
                  <th>Period</th>
                  <th>Gross Earnings</th>
                  <th>Statutory Ded.</th>
                  <th>Taxes (TDS)</th>
                  <th>Total Deductions</th>
                  <th>Net Paid</th>
                  <th>Process Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.empCode}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Avatar style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                          <AvatarFallback style={{ background: 'var(--bg-main)', color: getDeptColor(p.department), fontSize: '0.85rem', fontWeight: 700 }}>
                            {(p.employeeName || '').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700 }}>{p.employeeName}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{p.designation}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Calendar size={13} style={{ color: 'var(--secondary)' }} />
                        {p.month} {p.year}
                      </span>
                    </td>
                    <td>{formatCurrency(p.grossEarnings)}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>PF: {formatCurrency(p.deductions.epf)}</span>
                        {p.deductions.esi > 0 && <span style={{ display: 'block' }}>ESI: {formatCurrency(p.deductions.esi)}</span>}
                      </div>
                    </td>
                    <td>{formatCurrency(p.deductions.tds)}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>
                      {formatCurrency(p.deductions.total)}
                    </td>
                    <td style={{ color: 'var(--success)', fontWeight: 800 }}>
                      {formatCurrency(p.netSalary)}
                    </td>
                    <td>{p.processedDate}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="custom-btn custom-btn-secondary" 
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', width: 'auto' }}
                          title="Generate Payslip"
                          onClick={() => handleViewPayslip(p)}
                        >
                          <FileText size={13} />
                          <span>Payslip</span>
                        </button>
                        <button 
                          className="custom-btn-icon" 
                          style={{ color: 'var(--danger)', background: 'transparent' }}
                          title="Delete Record"
                          onClick={() => handleDelete(p.id, p.employeeName, `${p.month} ${p.year}`)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)' }}>
            No matching payroll historical ledger entries.
          </div>
        )}
      </section>
    </div>
  );
}
