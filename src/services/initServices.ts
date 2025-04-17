
import { initDentistAvailabilityProcedures } from './dentistAvailabilityRPC';

// Initialize all services
export const initServices = async () => {
  // Initialize dentist availability procedures
  await initDentistAvailabilityProcedures();
};
