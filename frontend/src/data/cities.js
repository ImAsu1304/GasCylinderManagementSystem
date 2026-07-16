// City-based pricing for LPG cylinders (2025 approximate Indian market prices)
// Prices vary by city and provider

export const cities = [
  'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Patna', 'Chandigarh', 'Bhopal', 'Guwahati'
];

export const states = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// Default prices (used when API is not available)
export const defaultPrices = {
  DOMESTIC: {
    Delhi: 803.00, Mumbai: 802.50, Kolkata: 829.00, Chennai: 818.50,
    Bangalore: 819.00, Hyderabad: 845.50, Pune: 802.50, Ahmedabad: 803.00,
    Jaipur: 803.00, Lucknow: 803.00, Patna: 829.50, Chandigarh: 803.00,
    Bhopal: 810.00, Guwahati: 852.00
  },
  COMMERCIAL: {
    Delhi: 1802.00, Mumbai: 1750.50, Kolkata: 1907.00, Chennai: 1964.50,
    Bangalore: 1908.50, Hyderabad: 1956.00, Pune: 1750.50, Ahmedabad: 1795.00,
    Jaipur: 1802.00, Lucknow: 1802.00, Patna: 1907.50, Chandigarh: 1802.00,
    Bhopal: 1836.00, Guwahati: 1942.00
  },
  FIVEKG: {
    Delhi: 339.00, Mumbai: 336.50, Kolkata: 348.00, Chennai: 343.00,
    Bangalore: 343.50, Hyderabad: 355.00, Pune: 336.50, Ahmedabad: 338.00,
    Jaipur: 339.00, Lucknow: 339.00, Patna: 348.50, Chandigarh: 339.00,
    Bhopal: 342.00, Guwahati: 358.00
  }
};

// GST rates
export const gstRates = {
  DOMESTIC: 0,        // Domestic LPG is exempt from GST
  COMMERCIAL: 5,      // 5% GST on commercial LPG
  FIVEKG: 5           // 5% GST on Free Trade cylinders
};

export const getPrice = (cylinderType, city) => {
  const prices = defaultPrices[cylinderType];
  return prices ? (prices[city] || prices['Delhi']) : 0;
};

export const getGST = (cylinderType, basePrice) => {
  const rate = gstRates[cylinderType] || 0;
  return (basePrice * rate) / 100;
};

export const cityStateMap = {
  Delhi: 'Delhi',
  Mumbai: 'Maharashtra',
  Kolkata: 'West Bengal',
  Chennai: 'Tamil Nadu',
  Bangalore: 'Karnataka',
  Hyderabad: 'Telangana',
  Pune: 'Maharashtra',
  Ahmedabad: 'Gujarat',
  Jaipur: 'Rajasthan',
  Lucknow: 'Uttar Pradesh',
  Patna: 'Bihar',
  Chandigarh: 'Chandigarh',
  Bhopal: 'Madhya Pradesh',
  Guwahati: 'Assam',
};
