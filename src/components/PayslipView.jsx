import React, { useContext } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { numberToWords } from '../utils/calculations';
import { Printer, X } from 'lucide-react';

export default function PayslipView() {
  const { selectedPayslip, setSelectedPayslip, config } = useContext(PayrollContext);

  if (!selectedPayslip) return null;

  const {
    employeeName,
    empCode,
    designation,
    department,
    panNo,
    bankName,
    accountNumber,
    ifscCode,
    month,
    year,
    earnings,
    deductions,
    grossEarnings,
    netSalary,
    workDays,
    lopDays,
    overtimeHours
  } = selectedPayslip;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 2
    }).format(val);
  };

  const netInWords = numberToWords(netSalary);

  return (
    <div className="custom-modal-overlay no-print" style={{ zIndex: 9999 }}>
      <div className="custom-modal animate-scale" style={{ maxWidth: '850px', width: '95%' }}>
        <div className="custom-modal-header">
          <h3 style={{ fontSize: '1.25rem' }}>Employee Payslip</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="custom-btn custom-btn-primary" onClick={handlePrint} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', width: 'auto' }}>
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
            <button className="custom-btn-icon" onClick={() => setSelectedPayslip(null)}>
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="custom-modal-body" style={{ background: 'var(--bg-main)', padding: '2rem' }}>
          
          {/* Printable Payslip Structure */}
          <div className="payslip-print-container">
            <div className="payslip-wrapper" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem', background: '#ffffff', boxShadow: 'var(--shadow-double)' }}>
              
              {/* Company Logo and Header */}
              <div className="payslip-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div className="payslip-logo-section" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="payslip-comp-name" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{config.companyName}</span>
                  <span className="payslip-comp-address" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{config.companyAddress}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    {config.companyRegNo}
                  </span>
                </div>
                <div className="payslip-title-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <span className="payslip-main-title" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.05em' }}>PAYSLIP</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {month} {year}
                  </span>
                </div>
              </div>

              {/* Employee & Bank Metadata */}
              <div className="payslip-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                <div className="payslip-meta-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Employee Name:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{employeeName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Employee Code:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{empCode}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Designation:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{designation}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Department:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{department}</span>
                  </div>
                </div>

                <div className="payslip-meta-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Bank Name:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{bankName || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Account No:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{accountNumber || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>IFSC Code:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{ifscCode || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>PAN Number:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{panNo || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Attendance metrics */}
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span><strong>Working Days:</strong> {workDays}</span>
                <span><strong>LOP Days:</strong> {lopDays}</span>
                <span><strong>Overtime Hours:</strong> {overtimeHours} hrs</span>
              </div>

              {/* Earnings & Deductions breakdown table */}
              <table className="payslip-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ width: '35%', textAlign: 'left', padding: '8px 0', fontSize: '0.85rem' }}>Earnings</th>
                    <th style={{ width: '15%', textAlign: 'right', padding: '8px 0', fontSize: '0.85rem' }}>Amount ({config.currencySymbol})</th>
                    <th style={{ width: '35%', textAlign: 'left', padding: '8px 0', fontSize: '0.85rem' }}>Deductions</th>
                    <th style={{ width: '15%', textAlign: 'right', padding: '8px 0', fontSize: '0.85rem' }}>Amount ({config.currencySymbol})</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.85rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--bg-main)' }}>
                    <td style={{ padding: '8px 0' }}>Basic Salary</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>{formatCurrency(earnings.base).replace(config.currencySymbol, '').trim()}</td>
                    <td style={{ padding: '8px 0' }}>Provident Fund (EPF)</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger)', padding: '8px 0' }}>{formatCurrency(deductions.epf).replace(config.currencySymbol, '').trim()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-main)' }}>
                    <td style={{ padding: '8px 0' }}>House Rent Allowance (HRA)</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>{formatCurrency(earnings.hra).replace(config.currencySymbol, '').trim()}</td>
                    <td style={{ padding: '8px 0' }}>Employee State Ins. (ESI)</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger)', padding: '8px 0' }}>{formatCurrency(deductions.esi).replace(config.currencySymbol, '').trim()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-main)' }}>
                    <td style={{ padding: '8px 0' }}>Medical Allowance</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>{formatCurrency(earnings.medical).replace(config.currencySymbol, '').trim()}</td>
                    <td style={{ padding: '8px 0' }}>Professional Tax (PT)</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger)', padding: '8px 0' }}>{formatCurrency(deductions.pt).replace(config.currencySymbol, '').trim()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-main)' }}>
                    <td style={{ padding: '8px 0' }}>Special Allowance</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>{formatCurrency(earnings.special).replace(config.currencySymbol, '').trim()}</td>
                    <td style={{ padding: '8px 0' }}>Income Tax (TDS)</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger)', padding: '8px 0' }}>{formatCurrency(deductions.tds).replace(config.currencySymbol, '').trim()}</td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0' }}>Overtime Payout</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>{formatCurrency(earnings.overtime).replace(config.currencySymbol, '').trim()}</td>
                    <td style={{ padding: '8px 0' }}>Loss of Pay (LOP) Deduction</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger)', padding: '8px 0' }}>{formatCurrency(deductions.lop).replace(config.currencySymbol, '').trim()}</td>
                  </tr>
                  
                  {/* Totals Row */}
                  <tr style={{ fontWeight: 700 }}>
                    <td style={{ padding: '12px 0' }}>Gross Earnings</td>
                    <td style={{ textAlign: 'right', padding: '12px 0' }}>
                      {formatCurrency(grossEarnings).replace(config.currencySymbol, '').trim()}
                    </td>
                    <td style={{ padding: '12px 0' }}>Total Deductions</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger)', padding: '12px 0' }}>
                      {formatCurrency(deductions.total).replace(config.currencySymbol, '').trim()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Net Payout Box */}
              <div className="payslip-net-box" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="payslip-net-label" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Net Salary Distributed:</span>
                <span className="payslip-net-val" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--success)' }}>{formatCurrency(netSalary)}</span>
              </div>

              {/* Net Salary in Words */}
              <div className="payslip-words" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Amount in words:</strong> {netInWords}
              </div>

              {/* Signatures */}
              <div className="payslip-signatures" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem' }}>
                <div className="payslip-sig-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                  <div style={{ height: '40px' }}></div>
                  <span style={{ borderTop: '1px solid var(--text-tertiary)', width: '100%', textAlign: 'center', fontSize: '0.8rem', paddingTop: '4px', color: 'var(--text-secondary)' }}>Employee Signature</span>
                </div>
                <div className="payslip-sig-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
                  <div style={{ height: '40px' }}></div>
                  <span style={{ borderTop: '1px solid var(--text-tertiary)', width: '100%', textAlign: 'center', fontSize: '0.8rem', paddingTop: '4px', color: 'var(--text-secondary)' }}>Authorized Representative</span>
                  <span style={{ fontSize: '0.65rem', fontStyle: 'italic', marginTop: '2px', color: 'var(--text-tertiary)' }}>{config.companyName}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
        <div className="custom-modal-footer no-print">
          <button className="custom-btn custom-btn-secondary" style={{ width: 'auto' }} onClick={() => setSelectedPayslip(null)}>Close Window</button>
        </div>
      </div>
    </div>
  );
}
