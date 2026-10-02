/**
 * Indian Rupee & Number Formatters for GST RecoManager
 */

export const formatINR = (value: number, options: { compact?: boolean; decimals?: number } = {}): string => {
  const { compact = false, decimals = 2 } = options;

  if (isNaN(value)) return '₹ 0.00';

  if (compact) {
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absVal >= 10000000) {
      // Crores
      return `${sign}₹ ${(absVal / 10000000).toFixed(decimals)} Cr`;
    }
    if (absVal >= 100000) {
      // Lakhs
      return `${sign}₹ ${(absVal / 100000).toFixed(decimals)} L`;
    }
    if (absVal >= 1000) {
      // Thousands
      return `${sign}₹ ${(absVal / 1000).toFixed(decimals)} K`;
    }
    return `${sign}₹ ${absVal.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }

  return '₹ ' + value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatNumberIndian = (value: number): string => {
  if (isNaN(value)) return '0';
  return value.toLocaleString('en-IN');
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-IN', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

export const isValidGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim());
};

export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.trim());
};

export const getStateFromGstin = (gstin: string): string => {
  if (!gstin || gstin.length < 2) return 'Unknown';
  const code = gstin.substring(0, 2);
  const stateMap: Record<string, string> = {
    '01': 'Jammu & Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '05': 'Uttarakhand',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '19': 'West Bengal',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '27': 'Maharashtra',
    '29': 'Karnataka',
    '33': 'Tamil Nadu',
    '36': 'Telangana',
    '37': 'Andhra Pradesh',
  };
  return stateMap[code] || `State Code ${code}`;
};
