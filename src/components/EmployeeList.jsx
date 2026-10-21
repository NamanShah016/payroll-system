import React from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';

export default function EmployeeList() {
  const { employees, activeEmployee, setActiveEmployee } = useEmployeeContext();

  return (
    <div className="card table-card">
      <h2 className="card-title">Registered Employees</h2>
      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name</th>
              <th>Department</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees && employees.length > 0 ? (
              employees.map((emp, index) => {
                const isActive = activeEmployee && activeEmployee.id === emp.id;
                return (
                  <tr
                    key={emp.id || index}
                    className={isActive ? 'active-row' : ''}
                    onClick={() => setActiveEmployee(emp)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view details"
                  >
                    <td>{index + 1}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>₹{emp.salary}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center no-data">
                  No employee records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
