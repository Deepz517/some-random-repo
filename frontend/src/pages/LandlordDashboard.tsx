import PropertyList from '../components/PropertyList';
import TenantList from '../components/TenantList';
import LeaseList from '../components/LeaseList';
import PaymentList from '../components/PaymentList';
import UtilityBillList from '../components/UtilityBillList';
import { Container } from '@mui/material';

function LandlordDashboard() {
  return (
    <Container>
      <h1>Landlord Dashboard</h1>
      <PropertyList />
      <TenantList />
      <LeaseList />
      <PaymentList />
      <UtilityBillList />
    </Container>
  );
}

export default LandlordDashboard;
