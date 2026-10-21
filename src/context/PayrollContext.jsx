import React, { createContext, useState, useEffect } from 'react';

export const PayrollContext = createContext();

const DEFAULT_SLABS = [
  { id: '1', min: 0, max: 300000, rate: 0 },
  { id: '2', min: 300000, max: 600000, rate: 5 },
  { id: '3', min: 600000, max: 900000, rate: 10 },
  { id: '4', min: 900000, max: 1200000, rate: 15 },
  { id: '5', min: 1200000, max: 1500000, rate: 20 },
  { id: '6', min: 1500000, max: null, rate: 30 }
];

const DEFAULT_CONFIG = {
  companyName: 'Apex Innovations Private Limited',
  companyAddress: 'Tech Oasis Park, Tower B - 8th Floor, Bangalore, KA, 560001',
  companyRegNo: 'CIN: U72200KA2021PTC142850',
  currency: 'INR',
  currencySymbol: '₹',
  enableEPF: true,
  epfRatePercent: 12,
  epfMaxBaseLimit: 15000,
  enableESI: true,
  esiRatePercent: 0.75,
  esiGrossLimit: 21000,
  enablePT: true,
  enableTDS: true,
  otRateMultiplier: 1.5,
  taxSlabs: DEFAULT_SLABS
};

const DEFAULT_EMPLOYEES = [
  {
    id: 'emp-101',
    empCode: 'EMP001',
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@apexinnovations.com',
    phone: '+91 98765 43210',
    designation: 'Lead Software Architect',
    department: 'Engineering',
    joiningDate: '2022-03-15',
    status: 'Active',
    baseSalary: 95000,
    hra: 38000,
    medicalAllowance: 1250,
    specialAllowance: 15000,
    bankName: 'HDFC Bank',
    accountNumber: '50100293847291',
    ifscCode: 'HDFC0000120',
    panNo: 'ABCDE1234F',
    enableEPF: true,
    enableESI: false,
    enableTDS: true,
    skills: ['React', 'Node.js', 'System Design', 'TypeScript', 'GraphQL'],
    bio: 'Expert architect leading core web platforms. Passionate about building modular UI frameworks and designing highly scalable client-side systems.',
    locationType: 'Remote',
    experienceYears: 8,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
    onboardingSteps: [
      { id: 'step-1', name: 'Identity & Access Setup', completed: true, date: '2022-03-15' },
      { id: 'step-2', name: 'Compliance & Safety Briefing', completed: true, date: '2022-03-16' },
      { id: 'step-3', name: 'Architecture Walkthrough', completed: true, date: '2022-03-18' }
    ]
  },
  {
    id: 'emp-102',
    empCode: 'EMP002',
    fullName: 'Michael Chen',
    email: 'm.chen@apexinnovations.com',
    phone: '+91 98765 43211',
    designation: 'Senior Product Manager',
    department: 'Product Management',
    joiningDate: '2023-01-10',
    status: 'Active',
    baseSalary: 80000,
    hra: 32000,
    medicalAllowance: 1250,
    specialAllowance: 10000,
    bankName: 'ICICI Bank',
    accountNumber: '000401567890',
    ifscCode: 'ICIC0000004',
    panNo: 'FGHIJ5678K',
    enableEPF: true,
    enableESI: false,
    enableTDS: true,
    skills: ['Agile', 'Product Strategy', 'Figma', 'User Research'],
    bio: 'Product veteran coordinating cross-functional lifecycle releases. Focused on translating analytical user metrics into structured roadmaps.',
    locationType: 'Hybrid',
    experienceYears: 6,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Michael',
    onboardingSteps: [
      { id: 'step-1', name: 'Identity & Access Setup', completed: true, date: '2023-01-10' },
      { id: 'step-2', name: 'Compliance & Safety Briefing', completed: true, date: '2023-01-11' }
    ]
  },
  {
    id: 'emp-103',
    empCode: 'EMP003',
    fullName: 'Anita Patel',
    email: 'anita.p@apexinnovations.com',
    phone: '+91 98765 43212',
    designation: 'HR Operations Manager',
    department: 'Human Resources',
    joiningDate: '2023-08-01',
    status: 'Active',
    baseSalary: 45000,
    hra: 18000,
    medicalAllowance: 1250,
    specialAllowance: 5000,
    bankName: 'Axis Bank',
    accountNumber: '912010045672938',
    ifscCode: 'UTIB0000010',
    panNo: 'LMNOP9012Q',
    enableEPF: true,
    enableESI: false,
    enableTDS: true,
    skills: ['Sourcing', 'Interviewing', 'Compensation', 'Negotiation'],
    bio: 'Driving global hiring channels and employee engagement strategies. Enthusiastic about creating highly welcoming onboarding experiences.',
    locationType: 'Onsite',
    experienceYears: 4,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Anita',
    onboardingSteps: [
      { id: 'step-1', name: 'Identity & Access Setup', completed: true, date: '2023-08-01' },
      { id: 'step-2', name: 'Compliance & Safety Briefing', completed: true, date: '2023-08-02' }
    ]
  },
  {
    id: 'emp-104',
    empCode: 'EMP004',
    fullName: 'David Kim',
    email: 'david.k@apexinnovations.com',
    phone: '+91 98765 43213',
    designation: 'UI/UX Visual Designer',
    department: 'Design',
    joiningDate: '2024-02-15',
    status: 'Active',
    baseSalary: 38000,
    hra: 15200,
    medicalAllowance: 1250,
    specialAllowance: 3000,
    bankName: 'State Bank of India',
    accountNumber: '30495810293',
    ifscCode: 'SBIN0001234',
    panNo: 'RSTUV3456W',
    enableEPF: true,
    enableESI: false,
    enableTDS: true,
    skills: ['Figma', 'Design Systems', 'Illustration', 'Prototyping'],
    bio: 'Crafting visually memorable brand structures, UI patterns, and layout guidelines. Believes that micro-interactions define true user delight.',
    locationType: 'Remote',
    experienceYears: 5,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
    onboardingSteps: [
      { id: 'step-1', name: 'Identity & Access Setup', completed: true, date: '2024-02-15' },
      { id: 'step-2', name: 'Compliance & Safety Briefing', completed: true, date: '2024-02-16' }
    ]
  },
  {
    id: 'emp-105',
    empCode: 'EMP005',
    fullName: 'Rohan Sharma',
    email: 'rohan.s@apexinnovations.com',
    phone: '+91 98765 43214',
    designation: 'Junior Frontend Intern',
    department: 'Engineering',
    joiningDate: '2025-06-01',
    status: 'Active',
    baseSalary: 15000,
    hra: 6000,
    medicalAllowance: 1000,
    specialAllowance: 1000,
    bankName: 'Kotak Mahindra Bank',
    accountNumber: '7483920192',
    ifscCode: 'KKBK0000456',
    panNo: 'XYZAB7890C',
    enableEPF: true,
    enableESI: true,
    enableTDS: false,
    skills: ['HTML/CSS', 'JavaScript', 'React', 'TailwindCSS'],
    bio: 'Enthusiastic junior developer learning to build reusable component trees and optimize performance patterns.',
    locationType: 'Hybrid',
    experienceYears: 1,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan',
    onboardingSteps: [
      { id: 'step-1', name: 'Identity & Access Setup', completed: true, date: '2025-06-01' },
      { id: 'step-2', name: 'Compliance & Safety Briefing', completed: true, date: '2025-06-02' },
      { id: 'step-3', name: 'Engineering Kickoff meeting', completed: true, date: '2025-06-10' },
      { id: 'step-4', name: 'First PR Code Review', completed: true, date: '2025-06-18' }
    ]
  }
];

const DEFAULT_PAYROLLS = [
  {
    id: 'pay-001',
    month: 'July',
    year: '2026',
    processedDate: '2026-07-31',
    employeeId: 'emp-101',
    employeeName: 'Sarah Jenkins',
    empCode: 'EMP001',
    designation: 'Lead Software Architect',
    department: 'Engineering',
    panNo: 'ABCDE1234F',
    bankName: 'HDFC Bank',
    accountNumber: '50100293847291',
    earnings: {
      base: 95000,
      hra: 38000,
      medical: 1250,
      special: 15000,
      overtime: 0,
      stdBase: 95000,
      stdHra: 38000,
      stdMedical: 1250,
      stdSpecial: 15000,
      stdGross: 149250
    },
    deductions: {
      epf: 1800, // Capped base 15000 * 12%
      esi: 0,
      pt: 200,
      tds: 18750, // Simulated tax
      lop: 0,
      total: 20750
    },
    grossEarnings: 149250,
    netSalary: 128500,
    workDays: 26,
    lopDays: 0,
    overtimeHours: 0
  },
  {
    id: 'pay-002',
    month: 'July',
    year: '2026',
    processedDate: '2026-07-31',
    employeeId: 'emp-102',
    employeeName: 'Michael Chen',
    empCode: 'EMP002',
    designation: 'Senior Product Manager',
    department: 'Product Management',
    panNo: 'FGHIJ5678K',
    bankName: 'ICICI Bank',
    accountNumber: '000401567890',
    earnings: {
      base: 80000,
      hra: 32000,
      medical: 1250,
      special: 10000,
      overtime: 0,
      stdBase: 80000,
      stdHra: 32000,
      stdMedical: 1250,
      stdSpecial: 10000,
      stdGross: 123250
    },
    deductions: {
      epf: 1800,
      esi: 0,
      pt: 200,
      tds: 13500,
      lop: 0,
      total: 15500
    },
    grossEarnings: 123250,
    netSalary: 107750,
    workDays: 26,
    lopDays: 0,
    overtimeHours: 0
  },
  {
    id: 'pay-003',
    month: 'July',
    year: '2026',
    processedDate: '2026-07-31',
    employeeId: 'emp-105',
    employeeName: 'Rohan Sharma',
    empCode: 'EMP005',
    designation: 'Junior Frontend Intern',
    department: 'Engineering',
    panNo: 'XYZAB7890C',
    bankName: 'Kotak Mahindra Bank',
    accountNumber: '7483920192',
    earnings: {
      base: 15000,
      hra: 6000,
      medical: 1000,
      special: 1000,
      overtime: 937.5, // 5 hours overtime
      stdBase: 15000,
      stdHra: 6000,
      stdMedical: 1000,
      stdSpecial: 1000,
      stdGross: 23000
    },
    deductions: {
      epf: 1800,
      esi: 179.53, // 0.75% of gross (23937.5) = 179.53
      pt: 200,
      tds: 0,
      lop: 0,
      total: 2179.53
    },
    grossEarnings: 23937.5,
    netSalary: 21757.97,
    workDays: 26,
    lopDays: 0,
    overtimeHours: 5
  }
];

export const PayrollProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('payroll_employees');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
    return parsed.map(emp => ({
      ...emp,
      skills: Array.isArray(emp.skills) ? emp.skills : [],
      onboardingSteps: Array.isArray(emp.onboardingSteps) ? emp.onboardingSteps : [],
      avatar: emp.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(emp.fullName || 'User')}`,
      bio: emp.bio || '',
      experienceYears: Number(emp.experienceYears || 1),
      locationType: emp.locationType || 'Remote'
    }));
  });

  const [payrolls, setPayrolls] = useState(() => {
    const saved = localStorage.getItem('payroll_processed');
    return saved ? JSON.parse(saved) : DEFAULT_PAYROLLS;
  });

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('payroll_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('payroll_theme');
    return saved ? saved : 'light'; // Standard light theme base
  });

  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [skillsFilter, setSkillsFilter] = useState('');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('payroll_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('payroll_processed', JSON.stringify(payrolls));
  }, [payrolls]);

  useEffect(() => {
    localStorage.setItem('payroll_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('payroll_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Employee actions
  const addEmployee = (emp) => {
    const skillsVal = emp.skills || '';
    const skillsArray = Array.isArray(skillsVal)
      ? skillsVal
      : skillsVal.split(',').map(s => s.trim()).filter(Boolean);

    const newEmp = {
      fullName: emp.fullName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      designation: emp.designation || '',
      department: emp.department || 'Engineering',
      joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0],
      status: emp.status || 'Active',
      baseSalary: Number(emp.baseSalary || 0),
      hra: Number(emp.hra || 0),
      medicalAllowance: Number(emp.medicalAllowance || 1250),
      specialAllowance: Number(emp.specialAllowance || 0),
      bankName: emp.bankName || '',
      accountNumber: emp.accountNumber || '',
      ifscCode: emp.ifscCode || '',
      panNo: emp.panNo || '',
      enableEPF: emp.enableEPF !== false,
      enableESI: emp.enableESI !== false,
      enableTDS: emp.enableTDS !== false,
      skills: skillsArray,
      bio: emp.bio || '',
      experienceYears: Number(emp.experienceYears || 1),
      locationType: emp.locationType || 'Remote',
      avatar: emp.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(emp.fullName || 'User')}`,
      id: `emp-${Date.now()}`,
      empCode: emp.empCode || `EMP${String(employees.length + 1).padStart(3, '0')}`,
      onboardingSteps: emp.status === 'Onboarding' 
        ? [
            { id: 'step-1', name: 'Identity & Access Setup', completed: true, date: emp.joiningDate || new Date().toISOString().split('T')[0] },
            { id: 'step-2', name: 'Compliance & Safety Briefing', completed: false, date: '' },
            { id: 'step-3', name: 'Introductory Team Kickoff', completed: false, date: '' }
          ]
        : [
            { id: 'step-1', name: 'Identity & Access Setup', completed: true, date: emp.joiningDate || new Date().toISOString().split('T')[0] }
          ]
    };
    setEmployees((prev) => [newEmp, ...prev]);
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const processedSkills = Array.isArray(updatedFields.skills) 
            ? updatedFields.skills 
            : (updatedFields.skills ? updatedFields.skills.split(',').map(s => s.trim()).filter(Boolean) : emp.skills);
          
          return {
            ...emp,
            ...updatedFields,
            baseSalary: Number(updatedFields.baseSalary ?? emp.baseSalary),
            hra: Number(updatedFields.hra ?? emp.hra),
            medicalAllowance: Number(updatedFields.medicalAllowance ?? emp.medicalAllowance),
            specialAllowance: Number(updatedFields.specialAllowance ?? emp.specialAllowance),
            experienceYears: Number(updatedFields.experienceYears ?? emp.experienceYears),
            skills: processedSkills
          };
        }
        return emp;
      })
    );

    // Sync selected employee state if open
    setSelectedEmployee(prev => {
      if (prev && prev.id === id) {
        const processedSkills = Array.isArray(updatedFields.skills) 
          ? updatedFields.skills 
          : (updatedFields.skills ? updatedFields.skills.split(',').map(s => s.trim()).filter(Boolean) : prev.skills);
        return {
          ...prev,
          ...updatedFields,
          baseSalary: Number(updatedFields.baseSalary ?? prev.baseSalary),
          hra: Number(updatedFields.hra ?? prev.hra),
          medicalAllowance: Number(updatedFields.medicalAllowance ?? prev.medicalAllowance),
          specialAllowance: Number(updatedFields.specialAllowance ?? prev.specialAllowance),
          experienceYears: Number(updatedFields.experienceYears ?? prev.experienceYears),
          skills: processedSkills
        };
      }
      return prev;
    });
  };

  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    if (selectedEmployee && selectedEmployee.id === id) {
      setSelectedEmployee(null);
    }
  };

  const toggleOnboardingStep = (empId, stepId) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === empId && Array.isArray(emp.onboardingSteps)) {
          const updatedSteps = emp.onboardingSteps.map(step => {
            if (step.id === stepId) {
              return { 
                ...step, 
                completed: !step.completed,
                date: !step.completed ? new Date().toISOString().split('T')[0] : ''
              };
            }
            return step;
          });
          const allCompleted = updatedSteps.every(s => s.completed);
          return {
            ...emp,
            onboardingSteps: updatedSteps,
            status: allCompleted ? 'Active' : emp.status
          };
        }
        return emp;
      })
    );

    setSelectedEmployee(prev => {
      if (prev && prev.id === empId && Array.isArray(prev.onboardingSteps)) {
        const updatedSteps = prev.onboardingSteps.map(step => {
          if (step.id === stepId) {
            return { 
              ...step, 
              completed: !step.completed,
              date: !step.completed ? new Date().toISOString().split('T')[0] : ''
            };
          }
          return step;
        });
        const allCompleted = updatedSteps.every(s => s.completed);
        return {
          ...prev,
          onboardingSteps: updatedSteps,
          status: allCompleted ? 'Active' : prev.status
        };
      }
      return prev;
    });
  };

  // Payroll actions
  const processPayroll = (payrollRun) => {
    const runsWithIds = payrollRun.map((run) => ({
      ...run,
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      processedDate: new Date().toISOString().split('T')[0]
    }));
    setPayrolls((prev) => [...runsWithIds, ...prev]);
  };

  const deletePayrollRecord = (id) => {
    setPayrolls((prev) => prev.filter((p) => p.id !== id));
  };

  // Config actions
  const updateConfig = (newConfig) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <PayrollContext.Provider
      value={{
        employees,
        payrolls,
        config,
        activeTab,
        theme,
        selectedPayslip,
        selectedEmployee,
        skillsFilter,
        setActiveTab,
        setSelectedPayslip,
        setSelectedEmployee,
        setSkillsFilter,
        toggleTheme,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleOnboardingStep,
        processPayroll,
        deletePayrollRecord,
        updateConfig
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
};
