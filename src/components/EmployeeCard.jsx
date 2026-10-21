import React from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';

export default function EmployeeCard() {
  const { activeEmployee } = useEmployeeContext();

  return (
    <div className="card details-card">
      <h2 className="card-title">Employee Payroll Details</h2>
      {activeEmployee ? (
        <div className="details-body">
          <div className="detail-item">
            <span className="detail-label">Employee Name:</span>
            <span className="detail-value">{activeEmployee.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{activeEmployee.department}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Salary:</span>
            <span className="detail-value font-bold">₹{activeEmployee.salary}</span>
          </div>
        </div>
      ) : (
        <div className="empty-card-message">
          <p>Add an employee to view payroll details.</p>
        </div>
      )}
    </div>
  );
}
