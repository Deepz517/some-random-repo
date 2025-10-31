import { useEffect, useState } from 'react';
import api from '../services/api';
import StatisticCard from '../components/StatisticCard';
import PaymentMethodBreakdown from '../components/PaymentMethodBreakdown';
import OverdueStatusBreakdown from '../components/OverdueStatusBreakdown';
import LeaseExpiryTimeline from '../components/LeaseExpiryTimeline';
import PropertyList from '../components/PropertyList';
import TenantList from '../components/TenantList';
import LeaseList from '../components/LeaseList';
import PaymentList from '../components/PaymentList';
import UtilityBillList from '../components/UtilityBillList';
import { Container, Grid } from '@mui/material';

function LandlordDashboard() {
  const [totalMonthlyRentDue, setTotalMonthlyRentDue] = useState(0);
  const [totalOverdueAmount, setTotalOverdueAmount] = useState(0);
  const [collectionRate, setCollectionRate] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const rentDueResponse = await api.get('/analytics/total_monthly_rent_due');
        setTotalMonthlyRentDue(rentDueResponse.data.total_monthly_rent_due);

        const overdueAmountResponse = await api.get('/analytics/total_overdue_amount');
        setTotalOverdueAmount(overdueAmountResponse.data.total_overdue_amount);

        const collectionRateResponse = await api.get('/analytics/collection_rate');
        setCollectionRate(collectionRateResponse.data.collection_rate);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Container>
      <h1>Landlord Dashboard</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatisticCard title="Total Monthly Rent Due" value={formatCurrency(totalMonthlyRentDue)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatisticCard title="Total Overdue Amount" value={formatCurrency(totalOverdueAmount)} color="red" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatisticCard title="Collection Rate" value={`${collectionRate.toFixed(2)}%`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PaymentMethodBreakdown />
        </Grid>
        <Grid item xs={12} md={6}>
          <OverdueStatusBreakdown />
        </Grid>
        <Grid item xs={12}>
          <LeaseExpiryTimeline />
        </Grid>
      </Grid>
      <PropertyList />
      <TenantList />
      <LeaseList />
      <PaymentList />
      <UtilityBillList />
    </Container>
  );
}

export default LandlordDashboard;
