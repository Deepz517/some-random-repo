import TenantLease from '../components/TenantLease';
import TenantPayments from '../components/TenantPayments';
import TenantUtilityBills from '../components/TenantUtilityBills';
import { Container } from '@mui/material';

function TenantDashboard() {
  return (
    <Container>
      <h1>Tenant Dashboard</h1>
      <TenantLease />
      <TenantPayments />
      <TenantUtilityBills />
    </Container>
  );
}

export default TenantDashboard;
