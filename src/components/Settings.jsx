import React, { useContext, useState } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { Save, Plus, Trash2, ShieldAlert, Check } from 'lucide-react';

export default function Settings() {
  const { config, updateConfig } = useContext(PayrollContext);

  const [companyName, setCompanyName] = useState(config.companyName);
  const [companyAddress, setCompanyAddress] = useState(config.companyAddress);
  const [companyRegNo, setCompanyRegNo] = useState(config.companyRegNo);
  const [currency, setCurrency] = useState(config.currency);
  const [currencySymbol, setCurrencySymbol] = useState(config.currencySymbol);
  
  const [enableEPF, setEnableEPF] = useState(config.enableEPF);
  const [epfRatePercent, setEpfRatePercent] = useState(config.epfRatePercent);
  const [epfMaxBaseLimit, setEpfMaxBaseLimit] = useState(config.epfMaxBaseLimit);
  
  const [enableESI, setEnableESI] = useState(config.enableESI);
  const [esiRatePercent, setEsiRatePercent] = useState(config.esiRatePercent);
  const [esiGrossLimit, setEsiGrossLimit] = useState(config.esiGrossLimit);

  const [enablePT, setEnablePT] = useState(config.enablePT);
  const [enableTDS, setEnableTDS] = useState(config.enableTDS);
  const [otRateMultiplier, setOtRateMultiplier] = useState(config.otRateMultiplier);
  
  // Slabs state
  const [taxSlabs, setTaxSlabs] = useState(config.taxSlabs);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateConfig({
      companyName,
      companyAddress,
      companyRegNo,
      currency,
      currencySymbol,
      enableEPF,
      epfRatePercent: Number(epfRatePercent),
      epfMaxBaseLimit: Number(epfMaxBaseLimit),
      enableESI,
      esiRatePercent: Number(esiRatePercent),
      esiGrossLimit: Number(esiGrossLimit),
      enablePT,
      enableTDS,
      otRateMultiplier: Number(otRateMultiplier),
      taxSlabs
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSlabChange = (id, field, val) => {
    setTaxSlabs(prev => 
      prev.map(slab => {
        if (slab.id === id) {
          let updatedVal = val;
          if (field === 'rate') updatedVal = Number(val);
          else if (field === 'min') updatedVal = Number(val);
          else if (field === 'max') updatedVal = val === '' ? null : Number(val);
          return { ...slab, [field]: updatedVal };
        }
        return slab;
      })
    );
  };

  const addSlab = () => {
    const lastSlab = taxSlabs[taxSlabs.length - 1];
    const nextMin = lastSlab ? (lastSlab.max || lastSlab.min + 300000) : 0;
    const newSlab = {
      id: String(Date.now()),
      min: nextMin,
      max: nextMin + 300000,
      rate: 5
    };
    setTaxSlabs(prev => [...prev, newSlab]);
  };

  const removeSlab = (id) => {
    if (taxSlabs.length <= 1) {
      alert("At least one tax slab must exist.");
      return;
    }
    setTaxSlabs(prev => prev.filter(slab => slab.id !== id));
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <header className="no-print">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statutory Rules</span>
        <h1 style={{ marginTop: '0.25rem' }}>Config Settings</h1>
        <p>Customize payroll variables, tax rules, standard deductions, and company metadata.</p>
      </header>

      {isSaved && (
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
          <span><strong>Success!</strong> Configuration changes successfully saved to local system storage.</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Core Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Column 1: Company Profile & Constants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Company Metadata Card */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Company Corporate Profile</h3>
              
              <div className="custom-form-group">
                <label>Company Legal Name *</label>
                <input 
                  type="text" 
                  required
                  className="custom-input" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="custom-form-group">
                <label>Corporate Address *</label>
                <textarea 
                  required
                  rows="3"
                  className="custom-textarea" 
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>

              <div className="custom-form-group">
                <label>Registration Number (CIN/Reg No) *</label>
                <input 
                  type="text" 
                  required
                  className="custom-input" 
                  value={companyRegNo}
                  onChange={(e) => setCompanyRegNo(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="custom-form-group">
                  <label>Currency Code *</label>
                  <input 
                    type="text" 
                    required
                    className="custom-input" 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>
                <div className="custom-form-group">
                  <label>Currency Symbol *</label>
                  <input 
                    type="text" 
                    required
                    className="custom-input" 
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* General Constants Card */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Salary Constants</h3>

              <div className="custom-form-group">
                <label>Overtime Multiplier (Rate per hour) *</label>
                <input 
                  type="number" 
                  required
                  step="0.1"
                  min="1"
                  className="custom-input" 
                  value={otRateMultiplier}
                  onChange={(e) => setOtRateMultiplier(e.target.value)}
                />
              </div>

              <div className="custom-form-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', marginTop: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="enablePT"
                  checked={enablePT}
                  onChange={(e) => setEnablePT(e.target.checked)}
                />
                <label htmlFor="enablePT" style={{ cursor: 'pointer', margin: 0, fontWeight: 600 }}>Enable Professional Tax (PT) Slab</label>
              </div>

              <div className="custom-form-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="enableTDS"
                  checked={enableTDS}
                  onChange={(e) => setEnableTDS(e.target.checked)}
                />
                <label htmlFor="enableTDS" style={{ cursor: 'pointer', margin: 0, fontWeight: 600 }}>Enable Income Tax (TDS) Slabs</label>
              </div>
            </div>

          </div>

          {/* Column 2: Statutory Slabs (EPF/ESI) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* EPF Configuration */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Employee Provident Fund (EPF)</h3>
                <input 
                  type="checkbox" 
                  checked={enableEPF}
                  onChange={(e) => setEnableEPF(e.target.checked)}
                />
              </div>

              {enableEPF && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-slide-up">
                  <div className="custom-form-group">
                    <label>EPF Rate Percent (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      step="0.1"
                      className="custom-input" 
                      value={epfRatePercent}
                      onChange={(e) => setEpfRatePercent(e.target.value)}
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>EPF Salary Base Limit ({currencySymbol})</label>
                    <input 
                      type="number" 
                      min="0"
                      className="custom-input" 
                      value={epfMaxBaseLimit}
                      onChange={(e) => setEpfMaxBaseLimit(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ESI Configuration */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Employee State Insurance (ESI)</h3>
                <input 
                  type="checkbox" 
                  checked={enableESI}
                  onChange={(e) => setEnableESI(e.target.checked)}
                />
              </div>

              {enableESI && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-slide-up">
                  <div className="custom-form-group">
                    <label>ESI Rate Percent (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      step="0.01"
                      className="custom-input" 
                      value={esiRatePercent}
                      onChange={(e) => setEsiRatePercent(e.target.value)}
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>ESI Gross Eligibility Limit ({currencySymbol})</label>
                    <input 
                      type="number" 
                      min="0"
                      className="custom-input" 
                      value={esiGrossLimit}
                      onChange={(e) => setESI_Limit(e.target.value)} // Note: standard input handler fallback
                      value={esiGrossLimit}
                      onChange={(e) => setEsiGrossLimit(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Full-width Section: Income Tax Slabs */}
        {enableTDS && (
          <section className="premium-card animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Statutory Income Tax (TDS) Slabs</h3>
                <p style={{ fontSize: '0.825rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  Enter standard annual income ranges to calculate dynamic pro-rated tax deductions.
                </p>
              </div>
              <button type="button" className="custom-btn custom-btn-secondary" style={{ width: 'auto' }} onClick={addSlab}>
                <Plus size={16} />
                <span>Add Tax Slab</span>
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Min Annual Income ({currencySymbol})</th>
                    <th>Max Annual Income ({currencySymbol})</th>
                    <th>Tax Rate (%)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taxSlabs.map((slab, index) => (
                    <tr key={slab.id}>
                      <td>
                        <input 
                          type="number"
                          min="0"
                          className="custom-input"
                          style={{ width: '100%', maxWidth: '200px', padding: '0.35rem' }}
                          value={slab.min}
                          onChange={(e) => handleSlabChange(slab.id, 'min', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number"
                          placeholder="No Limit (Infinity)"
                          className="custom-input"
                          style={{ width: '100%', maxWidth: '200px', padding: '0.35rem' }}
                          value={slab.max === null ? '' : slab.max}
                          onChange={(e) => handleSlabChange(slab.id, 'max', e.target.value)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input 
                            type="number"
                            min="0"
                            max="100"
                            className="custom-input"
                            style={{ width: '90px', padding: '0.35rem' }}
                            value={slab.rate}
                            onChange={(e) => handleSlabChange(slab.id, 'rate', e.target.value)}
                          />
                          <span>%</span>
                        </div>
                      </td>
                      <td>
                        <button 
                          type="button"
                          className="custom-btn-icon"
                          style={{ color: 'var(--danger)', background: 'transparent' }}
                          onClick={() => removeSlab(slab.id)}
                          disabled={taxSlabs.length <= 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
          <button type="submit" className="custom-btn custom-btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>
            <Save size={18} />
            <span>Save Configurations</span>
          </button>
        </div>

      </form>
    </div>
  );
}
