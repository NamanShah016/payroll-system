import React, { useContext, useState } from 'react';
import { PayrollContext } from '../context/PayrollContext';
import { Search, Plus, MapPin, Award, X } from 'lucide-react';
import AddEmployeeModal from './AddEmployeeModal';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base-ui/avatar';

export default function EmployeeDirectory() {
  const { employees, setSelectedEmployee, skillsFilter, setSkillsFilter } = useContext(PayrollContext);

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Available unique tags for filtering
  const departments = ['All', ...new Set(employees.map(e => e.department))];
  const locations = ['All', 'Remote', 'Hybrid', 'Onsite'];
  const statuses = ['All', 'Active', 'Onboarding'];

  // Department color theme map
  const getDeptStyles = (dept) => {
    const d = dept ? dept.toLowerCase() : '';
    if (d.includes('eng')) return { bg: '#eff6ff', text: '#1e40af' }; // Blue
    if (d.includes('design')) return { bg: '#fff7ed', text: '#c2410c' }; // Terracotta/Amber
    if (d.includes('prod')) return { bg: '#faf5ff', text: '#6b21a8' }; // Purple
    if (d.includes('hr')) return { bg: '#f0fdfa', text: '#0d9488' }; // Teal
    return { bg: '#f8fafc', text: '#475569' }; // Default Slate
  };

  // Filtering logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          emp.empCode.toLowerCase().includes(search.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(search.toLowerCase()) ||
                          emp.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    
    const matchesDept = selectedDept === 'All' ? true : emp.department === selectedDept;
    const matchesLoc = selectedLoc === 'All' ? true : emp.locationType === selectedLoc;
    const matchesStatus = selectedStatus === 'All' ? true : emp.status === selectedStatus;
    
    const matchesSkill = skillsFilter 
      ? emp.skills.some(s => s.toLowerCase() === skillsFilter.toLowerCase()) 
      : true;

    return matchesSearch && matchesDept && matchesLoc && matchesStatus && matchesSkill;
  });

  const getInitials = (name) => {
    if (!name) return 'EE';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="animate-fade">
      <header className="search-filter-row">
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organization Roll</span>
          <h1 style={{ marginTop: '0.25rem' }}>Employee Directory</h1>
        </div>
        <button className="custom-btn custom-btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Register Employee</span>
        </button>
      </header>

      {/* Advanced Filter Panel */}
      <section className="premium-card animate-slide-up" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Search & Location filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="custom-search">
            <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search name, code, skills..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Location filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Environment:</span>
            <div className="tag-filter-list">
              {locations.map(loc => (
                <button
                  key={loc}
                  className={`tag-btn ${selectedLoc === loc ? 'active' : ''}`}
                  onClick={() => setSelectedLoc(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Department & Status lists */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          {/* Department filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Divisions:</span>
            <div className="tag-filter-list">
              {departments.map(dept => (
                <button
                  key={dept}
                  className={`tag-btn ${selectedDept === dept ? 'active' : ''}`}
                  onClick={() => setSelectedDept(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
            <div className="tag-filter-list">
              {statuses.map(st => (
                <button
                  key={st}
                  className={`tag-btn ${selectedStatus === st ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

      </section>

      {skillsFilter && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Filtering by competency:</span>
          <span className="skill-badge" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            {skillsFilter}
            <button 
              onClick={() => setSkillsFilter('')} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', padding: '2px', color: 'var(--secondary)', marginLeft: '4px' }}
            >
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      {/* Directory Grid */}
      <section className="directory-grid animate-slide-up">
        {filteredEmployees.map(emp => {
          const colors = getDeptStyles(emp.department);
          return (
            <div 
              key={emp.id} 
              className="employee-card"
              onClick={() => setSelectedEmployee(emp)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Avatar className="avatar-large" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                  <AvatarImage src={emp.avatar} alt={emp.fullName} />
                  <AvatarFallback style={{ backgroundColor: colors.bg, color: colors.text, fontSize: '0.95rem' }}>
                    {getInitials(emp.fullName)}
                  </AvatarFallback>
                </Avatar>
                
                <span className={`status-indicator ${
                  emp.status === 'Active' ? 'status-active' : 'status-onboarding'
                }`}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: emp.status === 'Active' ? 'var(--success)' : 'var(--accent)' 
                  }}></span>
                  {emp.status}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{emp.fullName}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, marginTop: '2px' }}>
                  {emp.empCode} • {emp.designation}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  <MapPin size={12} />
                  <span>{emp.locationType} ({emp.department})</span>
                </div>
              </div>

              {/* Skills badges */}
              <div className="skills-container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                {emp.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))}
                {emp.skills.length > 3 && (
                  <span className="skill-badge" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                    +{emp.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredEmployees.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-tertiary)' }}>
            No employee profiles found matching the criteria.
          </div>
        )}
      </section>

      {/* Add Employee Modal component */}
      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
