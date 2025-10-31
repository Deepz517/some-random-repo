import { useEffect, useState } from 'react';
import api from '../services/api';
import PaymentCard from './PaymentCard';
import PaymentForm from './PaymentForm';
import { Grid, Typography, Button } from '@mui/material';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/');
      setPayments(response.data);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCreate = () => {
    setEditingPayment(null);
    setIsModalVisible(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingPayment) {
        await api.put(`/payments/${editingPayment.id}`, values);
      } else {
        await api.post('/payments/', values);
      }
      fetchPayments();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save payment', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        My Payments
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Add Payment
      </Button>
      <Grid container spacing={3}>
        {payments.map((payment) => (
          <Grid item xs={12} key={payment.id}>
            <PaymentCard payment={payment} onEdit={() => handleEdit(payment)} />
          </Grid>
        ))}
      </Grid>
      <PaymentForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        initialValues={editingPayment}
      />
    </div>
  );
};

export default PaymentList;
