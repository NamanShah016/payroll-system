import React, { useContext, useState } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { X, User, CreditCard } from 'lucide-react';

export default function AddEmployeeModal({ isOpen, onClose }) {
  const { addEmployee } = useContext(PayrollContext);
  const [modalTab, setModalTab] = useState('profile');

  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    designation: '',
    department: 'Engineering',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    experienceYears: '1',
    skills: '',
    bio: '',
    locationType: 'Remote',
    avatar: '',
    baseSalary: '',
    hra: '',
    medicalAllowance: '1250',
    specialAllowance: '0',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    panNo: '',
    enableEPF: true,
    enableESI: true,
    enableTDS: true
  };

  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBaseSalaryChange = (e) => {
    const base = Number(e.target.value || 0);
    const calculatedHra = Math.round(base * 0.4);
    setFormData(prev => ({
      ...prev,
      baseSalary: e.target.value,
      hra: String(calculatedHra)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate panNo
    if (formData.panNo && formData.panNo.length !== 10) {
      alert("PAN card number must be exactly 10 characters.");
      return;
    }
    addEmployee(formData);
    setFormData(initialFormState);
    setModalTab('profile');
    onClose();
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal animate-scale" style={{ maxWidth: '650px', width: '90%' }}>
        <div className="custom-modal-header">
          <h3 style={{ fontSize: '1.25rem' }}>Register Roster Employee</h3>
          <button className="custom-btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', margin: '0 1.5rem', paddingBottom: '0.25rem', gap: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setModalTab('profile')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.75rem 0.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: modalTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: modalTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <User size={16} />
            <span>Profile details</span>
          </button>
          <button
            type="button"
            onClick={() => setModalTab('finance')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.75rem 0.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: modalTab === 'finance' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: modalTab === 'finance' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <CreditCard size={16} />
            <span>Compensation & Bank</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="custom-modal-body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            
            {modalTab === 'profile' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="custom-form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    className="custom-input"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Emily Stone"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="custom-form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      className="custom-input"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="emily.s@apexinnovations.com"
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="text" 
                      name="phone"
                      required
                      className="custom-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43219"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="custom-form-group">
                    <label>Designation *</label>
                    <input 
                      type="text" 
                      name="designation"
                      required
                      className="custom-input"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g. QA Automation Specialist"
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>Department *</label>
                    <select 
                      name="department"
                      className="custom-select"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product Management">Product Management</option>
                      <option value="Design">Design</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="custom-form-group">
                    <label>Workplace Mode</label>
                    <select 
                      name="locationType"
                      className="custom-select"
                      value={formData.locationType}
                      onChange={handleInputChange}
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>
                  <div className="custom-form-group">
                    <label>Experience (Years)</label>
                    <input 
                      type="number" 
                      name="experienceYears"
                      min="0"
                      className="custom-input"
                      value={formData.experienceYears}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>Roster Status</label>
                    <select 
                      name="status"
                      className="custom-select"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Onboarding">Onboarding</option>
                    </select>
                  </div>
                </div>

                <div className="custom-form-group">
                  <label>Date of Joining *</label>
                  <input 
                    type="date" 
                    name="joiningDate"
                    required
                    className="custom-input"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="custom-form-group">
                  <label>Skills (Comma Separated)</label>
                  <input 
                    type="text" 
                    name="skills"
                    className="custom-input"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. Cypress, Python, Selenium"
                  />
                </div>

                <div className="custom-form-group">
                  <label>Avatar URL (Optional)</label>
                  <input 
                    type="url" 
                    name="avatar"
                    className="custom-input"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="e.g. https://assets.watermelon.sh/wm_olivia.png"
                  />
                </div>

                <div className="custom-form-group">
                  <label>Biography Summary</label>
                  <textarea 
                    name="bio"
                    rows="3"
                    className="custom-textarea"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Brief professional profile statement..."
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="custom-form-group">
                    <label>Base Salary (Monthly) *</label>
                    <input 
                      type="number" 
                      name="baseSalary"
                      required
                      min="0"
                      className="custom-input"
                      value={formData.baseSalary}
                      onChange={handleBaseSalaryChange}
                      placeholder="e.g. 50000"
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>HRA Allowance (Monthly) *</label>
                    <input 
                      type="number" 
                      name="hra"
                      required
                      min="0"
                      className="custom-input"
                      value={formData.hra}
                      onChange={handleInputChange}
                      placeholder="e.g. 20000"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="custom-form-group">
                    <label>Medical Allowance (Monthly) *</label>
                    <input 
                      type="number" 
                      name="medicalAllowance"
                      required
                      min="0"
                      className="custom-input"
                      value={formData.medicalAllowance}
                      onChange={handleInputChange}
                      placeholder="e.g. 1250"
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>Special Allowance (Monthly)</label>
                    <input 
                      type="number" 
                      name="specialAllowance"
                      min="0"
                      className="custom-input"
                      value={formData.specialAllowance}
                      onChange={handleInputChange}
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="custom-form-group">
                    <label>Bank Name *</label>
                    <input 
                      type="text" 
                      name="bankName"
                      required
                      className="custom-input"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g. HDFC Bank"
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>Account Number *</label>
                    <input 
                      type="text" 
                      name="accountNumber"
                      required
                      className="custom-input"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 5010029384"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="custom-form-group">
                    <label>IFSC Code *</label>
                    <input 
                      type="text" 
                      name="ifscCode"
                      required
                      className="custom-input"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="e.g. HDFC0000120"
                    />
                  </div>
                  <div className="custom-form-group">
                    <label>PAN Number *</label>
                    <input 
                      type="text" 
                      name="panNo"
                      required
                      maxLength="10"
                      className="custom-input"
                      value={formData.panNo}
                      onChange={handleInputChange}
                      placeholder="e.g. ABCDE1234F"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                <div className="custom-form-group">
                  <label>Statutory Taxes & Deductions Toggles</label>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        name="enableEPF" 
                        checked={formData.enableEPF}
                        onChange={handleInputChange}
                      />
                      <span>Enable EPF</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        name="enableESI" 
                        checked={formData.enableESI}
                        onChange={handleInputChange}
                      />
                      <span>Enable ESI</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        name="enableTDS" 
                        checked={formData.enableTDS}
                        onChange={handleInputChange}
                      />
                      <span>Enable TDS</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="custom-modal-footer">
            <button type="button" className="custom-btn custom-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {modalTab === 'profile' ? (
              <button type="button" className="custom-btn custom-btn-primary" onClick={() => setModalTab('finance')}>
                Next: Compensation
              </button>
            ) : (
              <button type="submit" className="custom-btn custom-btn-primary">
                Register Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
