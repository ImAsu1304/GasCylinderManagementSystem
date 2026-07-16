export const popularBanks = [
  { id: 'sbi', name: 'State Bank of India', shortName: 'SBI', color: '#1a237e' },
  { id: 'hdfc', name: 'HDFC Bank', shortName: 'HDFC', color: '#004c8f' },
  { id: 'icici', name: 'ICICI Bank', shortName: 'ICICI', color: '#f37920' },
  { id: 'axis', name: 'Axis Bank', shortName: 'Axis', color: '#97144d' },
  { id: 'pnb', name: 'Punjab National Bank', shortName: 'PNB', color: '#003d7c' },
  { id: 'bob', name: 'Bank of Baroda', shortName: 'BoB', color: '#ed6c23' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', shortName: 'Kotak', color: '#ed1c24' },
  { id: 'yes', name: 'Yes Bank', shortName: 'Yes', color: '#0050a0' },
];

export const otherBanks = [
  { id: 'union', name: 'Union Bank of India' },
  { id: 'canara', name: 'Canara Bank' },
  { id: 'boi', name: 'Bank of India' },
  { id: 'iob', name: 'Indian Overseas Bank' },
  { id: 'idbi', name: 'IDBI Bank' },
  { id: 'indian', name: 'Indian Bank' },
  { id: 'central', name: 'Central Bank of India' },
  { id: 'uco', name: 'UCO Bank' },
  { id: 'bandhan', name: 'Bandhan Bank' },
  { id: 'rbl', name: 'RBL Bank' },
  { id: 'federal', name: 'Federal Bank' },
  { id: 'indusind', name: 'IndusInd Bank' },
  { id: 'south_indian', name: 'South Indian Bank' },
  { id: 'karur_vysya', name: 'Karur Vysya Bank' },
  { id: 'dcb', name: 'DCB Bank' },
];

export const upiApps = [
  { id: 'gpay', name: 'Google Pay', color: '#4285f4' },
  { id: 'phonepe', name: 'PhonePe', color: '#5f259f' },
  { id: 'paytm', name: 'Paytm', color: '#00baf2' },
  { id: 'bhim', name: 'BHIM', color: '#00897b' },
];

export const wallets = [
  { id: 'paytm_wallet', name: 'Paytm', color: '#00baf2' },
  { id: 'phonepe_wallet', name: 'PhonePe', color: '#5f259f' },
  { id: 'amazon_pay', name: 'Amazon Pay', color: '#ff9900' },
  { id: 'mobikwik', name: 'Mobikwik', color: '#e74c3c' },
];

export const detectCardBrand = (number) => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return { brand: 'Visa', color: '#1a1f71' };
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return { brand: 'Mastercard', color: '#eb001b' };
  if (/^6[0-9]/.test(cleaned) || /^81/.test(cleaned) || /^82/.test(cleaned) || /^508/.test(cleaned)) return { brand: 'RuPay', color: '#0072bc' };
  if (/^3[47]/.test(cleaned)) return { brand: 'Amex', color: '#006fcf' };
  return { brand: '', color: '#666' };
};

export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 16);
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
};

export const formatExpiry = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length >= 3) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  return cleaned;
};
