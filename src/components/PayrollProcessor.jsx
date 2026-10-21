import React, { useContext, useState, useEffect } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { calculateMonthlyPayroll } from '../utils/calculations';
import { 
  Calculator, 
  Check, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = ['2025', '2026', '2027'];

export default function PayrollProcessor() {
  const { employees, config, processPayroll, setActiveTab } = useContext(PayrollContext);
  
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [workingDays, setWorkingDays] = useState('26');
  
  const [payrollInputs, setPayrollInputs] = useState({});
  const [calculatedRuns, setCalculatedRuns] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const activeEmployees = employees.filter(emp => emp.status === 'Active');

  useEffect(() => {
    const initialInputs = {};
    activeEmployees.forEach(emp => {
      initialInputs[emp.id] = {
        lopDays: '0',
        overtimeHours: '0'
      };
    });
    setPayrollInputs(initialInputs);
    setCalculatedRuns([]);
    setIsCalculated(false);
    setIsProcessed(false);
  }, [employees, selectedMonth, selectedYear]);

  const handleInputChange = (empId, field, val) => {
    setPayrollInputs(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: val
      }
    }));
    setIsCalculated(false);
  };

  const handleCalculateAll = (e) => {
    e.preventDefault();
    if (activeEmployees.length === 0) return;

    const runs = activeEmployees.map(emp => {
      const inputs = payrollInputs[emp.id] || { lopDays: '0', overtimeHours: '0' };
      const calculated = calculateMonthlyPayroll(
        emp,
        config,
        Number(workingDays),
        Number(inputs.lopDays || 0),
        Number(inputs.overtimeHours || 0)
      );

      return {
        employeeId: emp.id,
        employeeName: emp.fullName,
        empCode: emp.empCode,
        designation: emp.designation,
        department: emp.department,
        panNo: emp.panNo,
        bankName: emp.bankName,
        accountNumber: emp.accountNumber,
        ifscCode: emp.ifscCode,
        month: selectedMonth,
        year: selectedYear,
        ...calculated
      };
    });

    setCalculatedRuns(runs);
    setIsCalculated(true);
  };

  const handleSavePayroll = () => {
    if (calculatedRuns.length === 0) return;
    
    processPayroll(calculatedRuns);
    setIsProcessed(true);
    
    setTimeout(() => {
      setActiveTab('history');
    }, 1500);
  };

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
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statutory Processing</span>
        <h1 style={{ marginTop: '0.25rem' }}>Process Monthly Payroll</h1>
        <p>Select billing period, input attendance metrics, and calculate final salaries.</p>
      </header>

      {activeEmployees.length === 0 ? (
        <section className="premium-card no-print" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={48} style={{ color: 'var(--warning)' }} />
          <h3>No Active Employees Found</h3>
          <p>Please register active employees in the directory before running payroll.</p>
          <button 
            className="custom-btn custom-btn-primary" 
            style={{ width: 'auto' }} 
            onClick={() => setActiveTab('directory')}
          >
            Go to Directory
          </button>
        </section>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Controls Card */}
          <section className="premium-card no-print">
            <form onSubmit={handleCalculateAll} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end' }}>
              <div className="custom-form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label>Month</label>
                <select 
                  className="custom-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={isProcessed}
                >
                  {MONTHS.map((m, idx) => (
                    <option key={idx} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="custom-form-group" style={{ flex: 1, minWidth: '120px' }}>
                <label>Year</label>
                <select 
                  className="custom-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={isProcessed}
                >
                  {YEARS.map((y, idx) => (
                    <option key={idx} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="custom-form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label>Total Working Days</label>
                <input 
                  type="number" 
                  min="1" 
                  max="31"
                  required
                  className="custom-input"
                  value={workingDays}
                  onChange={(e) => {
                    setWorkingDays(e.target.value);
                    setIsCalculated(false);
                  }}
                  disabled={isProcessed}
                />
              </div>

              <div style={{ flex: 1.5, minWidth: '220px', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                  type="submit" 
                  className="custom-btn custom-btn-secondary" 
                  style={{ flex: 1, padding: '0.7rem' }}
                  disabled={isProcessed}
                >
                  <Calculator size={16} />
                  <span>Compute Draft</span>
                </button>
                
                {isCalculated && (
                  <button 
                    type="button" 
                    className="custom-btn custom-btn-primary" 
                    style={{ flex: 1, padding: '0.7rem' }}
                    onClick={handleSavePayroll}
                    disabled={isProcessed}
                  >
                    <Check size={16} />
                    <span>Post & Lock</span>
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Alert messages */}
          {isProcessed && (
            <div className="premium-card no-print" style={{ 
              background: '#ecfdf5', 
              borderColor: '#059669', 
              color: '#065f46', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '1rem',
              fontWeight: 500
            }}>
              <Check size={20} />
              <span><strong>Success!</strong> Payroll for {selectedMonth} {selectedYear} has been computed, locked, and recorded. Redirecting to historical ledger...</span>
            </div>
          )}

          {/* Grid Input and Calculated Sheets */}
          <section className="premium-card no-print">
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18} style={{ color: 'var(--secondary)' }} />
              <span>Attendance & Payroll Ledger</span>
            </h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Salary Profile</th>
                    <th>LOP Days</th>
                    <th>OT Hours</th>
                    {isCalculated && (
                      <>
                        <th>Gross Earned</th>
                        <th>PF / Statutory</th>
                        <th>TDS / Taxes</th>
                        <th>Total Deductions</th>
                        <th>Net Payable</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeEmployees.map((emp) => {
                    const inputs = payrollInputs[emp.id] || { lopDays: '0', overtimeHours: '0' };
                    const calculated = calculatedRuns.find(r => r.employeeId === emp.id);
                    
                    const stdGross = Number(emp.baseSalary) + Number(emp.hra) + Number(emp.medicalAllowance) + Number(emp.specialAllowance);
                    
                    return (
                      <tr key={emp.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700 }}>{emp.fullName}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{emp.empCode}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                            <span>Base: {formatCurrency(emp.baseSalary)}</span>
                            <span style={{ color: 'var(--text-tertiary)' }}>Gross Std: {formatCurrency(stdGross)}</span>
                          </div>
                        </td>
                        <td>
                          <input 
                            type="number"
                            min="0"
                            max={workingDays}
                            className="custom-input"
                            style={{ width: '80px', padding: '0.35rem' }}
                            value={inputs.lopDays}
                            onChange={(e) => handleInputChange(emp.id, 'lopDays', e.target.value)}
                            disabled={isProcessed}
                          />
                        </td>
                        <td>
                          <input 
                            type="number"
                            min="0"
                            className="custom-input"
                            style={{ width: '80px', padding: '0.35rem' }}
                            value={inputs.overtimeHours}
                            onChange={(e) => handleInputChange(emp.id, 'overtimeHours', e.target.value)}
                            disabled={isProcessed}
                          />
                        </td>
                        
                        {isCalculated && calculated && (
                          <>
                            <td style={{ fontWeight: 600 }}>
                              {formatCurrency(calculated.grossEarnings)}
                            </td>
                            <td>
                              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column' }}>
                                <span>PF: {formatCurrency(calculated.deductions.epf)}</span>
                                <span style={{ color: 'var(--text-tertiary)' }}>ESI: {formatCurrency(calculated.deductions.esi)}</span>
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column' }}>
                                <span>TDS: {formatCurrency(calculated.deductions.tds)}</span>
                                <span style={{ color: 'var(--text-tertiary)' }}>PT: {formatCurrency(calculated.deductions.pt)}</span>
                              </div>
                            </td>
                            <td style={{ color: 'var(--danger)', fontWeight: 600 }}>
                              {formatCurrency(calculated.deductions.total)}
                            </td>
                            <td style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.95rem' }}>
                              {formatCurrency(calculated.netSalary)}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
