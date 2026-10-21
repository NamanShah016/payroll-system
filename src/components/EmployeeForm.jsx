import React, { useState } from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';

export default function EmployeeForm() {
  const { addEmployee } = useEmployeeContext();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Employee Name cannot be empty';
    }

    if (!department.trim()) {
      newErrors.department = 'Department cannot be empty';
    }

    if (!salary.toString().trim()) {
      newErrors.salary = 'Salary cannot be empty';
    } else if (isNaN(salary) || Number(salary) <= 0) {
      newErrors.salary = 'Salary must be a valid positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if valid
    setErrors({});

    // Add employee using context
    addEmployee(name.trim(), department.trim(), salary);

    // Clear form inputs
    setName('');
    setDepartment('');
    setSalary('');
  };

  return (
    <div className="card form-card">
      <h2 className="card-title">Employee Registration</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="emp-name">Employee Name</label>
          <input
            id="emp-name"
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="emp-department">Department</label>
          <input
            id="emp-department"
            type="text"
            placeholder="e.g. HR, IT, Finance"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={errors.department ? 'input-error' : ''}
          />
          {errors.department && (
            <span className="error-message">{errors.department}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="emp-salary">Salary</label>
          <input
            id="emp-salary"
            type="number"
            placeholder="e.g. 35000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className={errors.salary ? 'input-error' : ''}
          />
          {errors.salary && <span className="error-message">{errors.salary}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          Add Employee
        </button>
      </form>
    </div>
  );
}
