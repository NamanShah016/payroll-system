import React, { useContext, useState } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import { WigglingCards } from './WigglingCards';
import { 
  Users, 
  Award, 
  Activity, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function Overview() {
  const { employees, setActiveTab, setSelectedEmployee, setSkillsFilter } = useContext(EmployeeContext);

  const activeEmployees = employees.filter(e => e.status === 'Active');
  const onboardingEmployees = employees.filter(e => e.status === 'Onboarding');
  
  const handleSkillClick = (skill) => {
    setSkillsFilter(skill);
    setActiveTab('directory');
  };
  
  // Total skills aggregate
  const allSkills = employees.reduce((acc, emp) => {
    emp.skills.forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {});

  const topSkills = Object.entries(allSkills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Group by department
  const deptBreakdown = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  // Calculate onboarding progress percentages
  const onboardingDetails = onboardingEmployees.map(emp => {
    const totalSteps = emp.onboardingSteps.length;
    const completedSteps = emp.onboardingSteps.filter(s => s.completed).length;
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    return {
      ...emp,
      percentage
    };
  });

  const handleQuickViewOnboarding = (emp) => {
    setSelectedEmployee(emp);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <header>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workforce Snapshot</span>
        <h1 style={{ marginTop: '0.25rem' }}>Overview Hub</h1>
        <p>Monitor employee onboarding milestones, organizational health, and primary skills distribution.</p>
      </header>

      {/* Metrics Cards */}
      <section className="card-grid">
        <div className="premium-card">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Roster</span>
          <div className="metric-number">{employees.length}</div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>{activeEmployees.length} Active</span>
            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{onboardingEmployees.length} Onboarding</span>
          </p>
        </div>

        <div className="premium-card">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Training Pipeline</span>
          <div className="metric-number">{onboardingEmployees.length}</div>
          <p style={{ fontSize: '0.85rem' }}>New hires completing standard IT/HR compliance milestones.</p>
        </div>

        <div className="premium-card">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Domains</span>
          <div className="metric-number">{Object.keys(allSkills).length}</div>
          <p style={{ fontSize: '0.85rem' }}>Distinct skills indexed across current staff directory.</p>
        </div>
      </section>

      {/* Main Analytical Grid (Asymmetrical) */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }} className="animate-slide-up">
        
        {/* Onboarding Checklist Tracker */}
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Onboarding Progression</h3>
              <p style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>Track step verification status for newly registered staff.</p>
            </div>
            <Activity size={18} style={{ color: 'var(--accent)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, justifyContent: 'center' }}>
            {onboardingDetails.length > 0 ? (
              onboardingDetails.map(emp => (
                <div 
                  key={emp.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5rem', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleQuickViewOnboarding(emp)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{emp.fullName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{emp.designation} ({emp.department})</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>{emp.percentage}%</span>
                  </div>

                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${emp.percentage}%`, 
                      background: 'var(--secondary)',
                      borderRadius: '4px',
                      transition: 'width var(--transition-normal)'
                    }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>
                All employees are fully onboarded. No pending trainees.
              </div>
            )}
          </div>
        </div>

        {/* Right Column Stack (Separate Skills and Spotlight Cards) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Primary Skill Inventory Card */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Primary Skill Inventory</h3>
              <p style={{ fontSize: '0.825rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>Key competency indices across the roster. Click tags to filter.</p>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignContent: 'center', flex: 1 }}>
              {topSkills.map(([skill, count]) => (
                <div 
                  key={skill}
                  onClick={() => handleSkillClick(skill)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem', 
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="skill-badge-interactive"
                >
                  <span>{skill}</span>
                  <span style={{ 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)', 
                    color: '#ffffff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.65rem'
                  }}>
                    {count}
                  </span>
                </div>
              ))}
              {topSkills.length === 0 && (
                <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', width: '100%' }}>
                  No skills cataloged yet.
                </div>
              )}
            </div>
          </div>

          {/* Roster Spotlight Card */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Roster Spotlight</h3>
              <p style={{ fontSize: '0.825rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>Swipe or drag to browse spotlight profiles.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
              <WigglingCards employees={employees} onCardClick={setSelectedEmployee} />
            </div>
          </div>

        </div>

      </section>

      {/* Departments Summary Cards */}
      <section className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Departmental Ratios</h3>
            <p style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>Headcount density by organizational division.</p>
          </div>
          <button className="nav-link" style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', gap: '4px' }} onClick={() => setActiveTab('directory')}>
            <span>Directory Ledger</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {Object.entries(deptBreakdown).map(([dept, count], idx) => {
            const pct = Math.round((count / employees.length) * 100);
            return (
              <div 
                key={dept} 
                style={{ 
                  padding: '1.25rem', 
                  background: 'var(--bg-main)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{dept}</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 700 }}>{count} {count === 1 ? 'staff' : 'staffs'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <TrendingUp size={12} /> {pct}% of total
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
