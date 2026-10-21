/**
 * Payroll calculations and utility functions
 */

// Simple progressive tax slab calculation (Annual basis)
export const calculateTDS = (annualGross, taxSlabs) => {
  let tax = 0;
  let remaining = annualGross;
  
  // Sort slabs by min value
  const sortedSlabs = [...taxSlabs].sort((a, b) => a.min - b.min);
  
  for (let i = 0; i < sortedSlabs.length; i++) {
    const slab = sortedSlabs[i];
    const max = slab.max === null ? Infinity : slab.max;
    const range = max - slab.min;
    
    if (remaining > range) {
      tax += range * (slab.rate / 100);
      remaining -= range;
    } else {
      tax += remaining * (slab.rate / 100);
      break;
    }
  }
  
  return tax;
};

// Calculate monthly payroll components
export const calculateMonthlyPayroll = (employee, config, workDays, lopDays, overtimeHours) => {
  const { baseSalary, hra, medicalAllowance, specialAllowance } = employee;
  
  // 1. Calculate Standard Earnings (Full Month)
  const stdBase = Number(baseSalary || 0);
  const stdHra = Number(hra || 0);
  const stdMedical = Number(medicalAllowance || 0);
  const stdSpecial = Number(specialAllowance || 0);
  
  const stdGross = stdBase + stdHra + stdMedical + stdSpecial;
  
  // 2. Adjust for Loss of Pay (LOP)
  // LOP deduction is based on the actual standard gross per day
  const dailyRate = stdGross / Number(workDays || 30);
  const lopDeduction = dailyRate * Number(lopDays || 0);
  
  // Actual earnings before overtime (pro-rated)
  const actualBase = stdBase - ((stdBase / workDays) * lopDays);
  const actualHra = stdHra - ((stdHra / workDays) * lopDays);
  const actualMedical = stdMedical - ((stdMedical / workDays) * lopDays);
  const actualSpecial = stdSpecial - ((stdSpecial / workDays) * lopDays);
  
  const actualGrossBeforeOT = actualBase + actualHra + actualMedical + actualSpecial;
  
  // 3. Overtime Pay
  // Overtime rate: (Base / workDays / 8) * overtimeMultiplier * hours
  const hourlyRate = stdBase / Number(workDays || 30) / 8;
  const otRateMultiplier = Number(config.otRateMultiplier || 1.5);
  const overtimePay = hourlyRate * otRateMultiplier * Number(overtimeHours || 0);
  
  const grossEarnings = actualGrossBeforeOT + overtimePay;
  
  // 4. Deductions
  // EPF (Employee Provident Fund): 12% of (Base) up to a salary cap of 15,000 (standard is 15000 max base)
  let epf = 0;
  if (config.enableEPF && employee.enableEPF !== false) {
    const epfBase = Math.min(actualBase, Number(config.epfMaxBaseLimit || 15000));
    epf = epfBase * (Number(config.epfRatePercent || 12) / 100);
  }
  
  // ESI (Employee State Insurance): 0.75% of Gross if Gross <= 21,000
  let esi = 0;
  if (config.enableESI && employee.enableESI !== false) {
    const esiLimit = Number(config.esiGrossLimit || 21000);
    if (grossEarnings <= esiLimit) {
      esi = grossEarnings * (Number(config.esiRatePercent || 0.75) / 100);
    }
  }
  
  // Professional Tax (PT): standard slab
  let pt = 0;
  if (config.enablePT) {
    // Standard Indian PT slabs
    if (grossEarnings > 15000) pt = 200;
    else if (grossEarnings > 10000) pt = 150;
    else pt = 0;
  }
  
  // TDS / Income Tax: Based on Annual Estimate (Gross * 12)
  let tds = 0;
  if (config.enableTDS && employee.enableTDS !== false) {
    const annualGrossEstimate = grossEarnings * 12;
    const annualTax = calculateTDS(annualGrossEstimate, config.taxSlabs);
    tds = annualTax / 12;
  }
  
  const totalDeductions = epf + esi + pt + tds + lopDeduction;
  const netSalary = Math.max(0, grossEarnings - totalDeductions);
  
  return {
    earnings: {
      base: actualBase,
      hra: actualHra,
      medical: actualMedical,
      special: actualSpecial,
      overtime: overtimePay,
      stdBase,
      stdHra,
      stdMedical,
      stdSpecial,
      stdGross
    },
    deductions: {
      epf,
      esi,
      pt,
      tds,
      lop: lopDeduction,
      total: totalDeductions
    },
    grossEarnings,
    netSalary,
    workDays,
    lopDays,
    overtimeHours
  };
};

// Convert number to words (English)
export const numberToWords = (num) => {
  if (num === 0) return 'Zero';
  
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const formatThreeDigits = (n) => {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  };
  
  let integerPart = Math.floor(num);
  let decimalPart = Math.round((num - integerPart) * 100);
  
  let result = '';
  
  // Handle millions, thousands, etc.
  const units = [
    { label: 'Billion', value: 1000000000 },
    { label: 'Million', value: 1000000 },
    { label: 'Thousand', value: 1000 },
    { label: '', value: 1 }
  ];
  
  let temp = integerPart;
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const unitValue = Math.floor(temp / unit.value);
    if (unitValue > 0) {
      result += formatThreeDigits(unitValue) + ' ' + unit.label + ' ';
      temp %= unit.value;
    }
  }
  
  result = result.trim();
  
  if (decimalPart > 0) {
    result += ' and ' + formatThreeDigits(decimalPart) + ' Cents';
  }
  
  return result ? result + ' Only' : 'Zero';
};
