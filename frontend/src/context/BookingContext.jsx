import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

const initialState = {
  step: 1,
  provider: null,
  consumerNumber: '',
  mobileNumber: '',
  cylinderType: '',
  verifiedDetails: null,
  address: '',
  area: '',
  city: '',
  state: '',
  pinCode: '',
  landmark: '',
  preferredDate: '',
  timeSlot: '',
  specialInstructions: '',
  paymentMethod: '',
  paymentDetails: null,
  price: 0,
  gst: 0,
  total: 0,
  bookingResult: null,
};

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState(initialState);

  const updateBooking = useCallback((updates) => {
    setBooking(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setBooking(prev => ({ ...prev, step: Math.min(prev.step + 1, 6) }));
  }, []);

  const prevStep = useCallback(() => {
    setBooking(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  }, []);

  const goToStep = useCallback((step) => {
    setBooking(prev => ({ ...prev, step }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(initialState);
  }, []);

  const value = {
    booking,
    updateBooking,
    nextStep,
    prevStep,
    goToStep,
    resetBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
