import React, { useContext } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base-ui/avatar';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Award,
  CheckCircle,
  Circle,
  Trash2,
  CreditCard,
  Building
} from 'lucide-react';

export default function ProfileDetails() {
  const { 
    selectedEmployee, 
    setSelectedEmployee, 
    toggleOnboardingStep,
    deleteEmployee,
    config
  } = useContext(PayrollContext);

  if (!selectedEmployee) return null;

  const {
    id,
    fullName,
    empCode,
    email,
    phone,
    designation,
    department,
    joiningDate,
    status,
    experienceYears,
    skills,
    bio,
    locationType,
    onboardingSteps,
    baseSalary,
    hra,
    medicalAllowance,
    specialAllowance,
    bankName,
    accountNumber,
    ifscCode,
    panNo,
    enableEPF,
    enableESI,
    enableTDS
  } = selectedEmployee;

  const handleDelete = () => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete the profile of ${fullName}?`)) {
      deleteEmployee(id);
    }
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
    <div className="drawer-overlay" onClick={() => setSelectedEmployee(null)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Staff File</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{empCode}</span>
          </div>
          <button className="custom-btn-icon" onClick={() => setSelectedEmployee(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Card profile summary */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
            <Avatar style={{ width: '72px', height: '72px', borderRadius: '16px' }}>
              <AvatarImage src={selectedEmployee.avatar} alt={fullName} />
              <AvatarFallback style={{ background: 'var(--bg-main)', color: getDeptColor(department), fontSize: '1.6rem', fontWeight: 800 }}>
                {(fullName || '').split(' ').filter(Boolean).map(p => p[0]).join('').toUpperCase().slice(0, 2) || '??'}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 style={{ fontSize: '1.35rem' }}>{fullName}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {designation}
              </span>
            </div>

            <span className={`status-indicator ${
              status === 'Active' ? 'status-active' : 'status-onboarding'
            }`}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: status === 'Active' ? 'var(--success)' : 'var(--accent)' 
              }}></span>
              {status}
            </span>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Mail size={16} style={{ color: 'var(--text-tertiary)' }} />
              <a href={`mailto:${email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{email}</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Phone size={16} style={{ color: 'var(--text-tertiary)' }} />
              <span>{phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Calendar size={16} style={{ color: 'var(--text-tertiary)' }} />
              <span>Joined: {joiningDate} ({locationType})</span>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

          {/* Biography */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biography</h4>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>"{bio || 'No biography written yet.'}"</p>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

          {/* Skills checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Domains</h4>
            <div className="skills-container">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span key={index} className="skill-badge" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No skills documented.</span>
              )}
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

          {/* Salary & Bank Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary & Bank Account</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Base Salary:</span>
                <span style={{ fontWeight: 600 }}>{config.currencySymbol}{(baseSalary || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>HRA Allowance:</span>
                <span style={{ fontWeight: 600 }}>{config.currencySymbol}{(hra || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Medical Allowance:</span>
                <span style={{ fontWeight: 600 }}>{config.currencySymbol}{(medicalAllowance || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Special Allowance:</span>
                <span style={{ fontWeight: 600 }}>{config.currencySymbol}{(specialAllowance || 0).toLocaleString()}</span>
              </div>
              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.4rem', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Gross Estimate:</span>
                <span>{config.currencySymbol}{(baseSalary + hra + medicalAllowance + specialAllowance).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Bank Name:</span>
                <span style={{ fontWeight: 600 }}>{bankName || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Account Number:</span>
                <span style={{ fontWeight: 600 }}>{accountNumber || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>IFSC Code:</span>
                <span style={{ fontWeight: 600 }}>{ifscCode || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>PAN Number:</span>
                <span style={{ fontWeight: 600 }}>{panNo || 'N/A'}</span>
              </div>
            </div>

            {/* Stat Toggles Status */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="skill-badge" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: enableEPF ? '#ecfdf5' : '#fef2f2', color: enableEPF ? '#065f46' : '#991b1b', border: 'none' }}>
                EPF: {enableEPF ? 'Enabled' : 'Disabled'}
              </span>
              <span className="skill-badge" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: enableESI ? '#ecfdf5' : '#fef2f2', color: enableESI ? '#065f46' : '#991b1b', border: 'none' }}>
                ESI: {enableESI ? 'Enabled' : 'Disabled'}
              </span>
              <span className="skill-badge" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: enableTDS ? '#ecfdf5' : '#fef2f2', color: enableTDS ? '#065f46' : '#991b1b', border: 'none' }}>
                TDS: {enableTDS ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Onboarding milestones */}
          {onboardingSteps && onboardingSteps.length > 0 && (
            <>
              <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Onboarding Checklist
                </h4>
                <div className="timeline">
                  {onboardingSteps.map((step) => (
                    <div key={step.id} className="timeline-item">
                      <button 
                        onClick={() => toggleOnboardingStep(id, step.id)}
                        style={{ 
                          position: 'absolute', 
                          left: '-26px', 
                          top: '2px', 
                          background: 'transparent', 
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          color: step.completed ? 'var(--success)' : 'var(--text-tertiary)'
                        }}
                      >
                        {step.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                      </button>
                      <div className="timeline-content">
                        <span className="timeline-title" style={{ 
                          textDecoration: step.completed ? 'line-through' : 'none',
                          color: step.completed ? 'var(--text-tertiary)' : 'var(--text-primary)'
                        }}>
                          {step.name}
                        </span>
                        {step.completed && step.date && (
                          <span className="timeline-date">Verified on {step.date}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

          {/* Operations / Actions */}
          <button 
            className="custom-btn custom-btn-secondary" 
            style={{ 
              color: 'var(--danger)', 
              borderColor: 'rgba(225, 29, 72, 0.2)', 
              background: 'var(--danger-light)',
              width: '100%',
              marginTop: 'auto'
            }}
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            <span>Remove Employee Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
