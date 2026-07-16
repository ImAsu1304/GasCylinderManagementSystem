import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion';
import ProviderSelection from '../components/booking/ProviderSelection';
import ConsumerDetails from '../components/booking/ConsumerDetails';
import DeliveryDetails from '../components/booking/DeliveryDetails';
import OrderSummary from '../components/booking/OrderSummary';
import PaymentPage from '../components/booking/PaymentPage';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { HiCheck } from 'react-icons/hi';

const steps = ['Provider', 'Consumer', 'Delivery', 'Summary', 'Payment', 'Confirmed'];

export default function BookingFlow() {
  const { booking } = useBooking();
  const { step } = booking;

  const renderStep = () => {
    switch (step) {
      case 1: return <ProviderSelection />;
      case 2: return <ConsumerDetails />;
      case 3: return <DeliveryDetails />;
      case 4: return <OrderSummary />;
      case 5: return <PaymentPage />;
      case 6: return <BookingConfirmation />;
      default: return <ProviderSelection />;
    }
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: 60 }}>
      <div className="container-narrow">
        {/* Step Indicator */}
        {step < 6 && (
          <div className="step-indicator">
            {steps.slice(0, 5).map((s, i) => (
              <div key={i} className="step-item">
                <motion.div
                  className={`step-circle ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
                  initial={false}
                  animate={i + 1 === step ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {i + 1 < step ? <HiCheck size={16} /> : i + 1}
                </motion.div>
                {i < 4 && <div className={`step-line ${i + 1 < step ? 'completed' : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35 }}
        >
          {renderStep()}
        </motion.div>
      </div>
    </div>
  );
}
