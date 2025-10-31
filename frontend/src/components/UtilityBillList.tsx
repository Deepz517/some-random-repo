import { useEffect, useState } from 'react';
import api from '../services/api';
import UtilityBillCard from './UtilityBillCard';
import UtilityBillForm from './UtilityBillForm';
import { Grid, Typography, Button } from '@mui/material';

const UtilityBillList = () => {
  const [utilityBills, setUtilityBills] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUtilityBill, setEditingUtilityBill] = useState(null);

  const fetchUtilityBills = async () => {
    try {
      const response = await api.get('/utility_bills/');
      setUtilityBills(response.data);
    } catch (error) {
      console.error('Failed to fetch utility bills', error);
    }
  };

  useEffect(() => {
    fetchUtilityBills();
  }, []);

  const handleCreate = () => {
    setEditingUtilityBill(null);
    setIsModalVisible(true);
  };

  const handleEdit = (utilityBill) => {
    setEditingUtilityBill(utilityBill);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'image') {
          formData.append('file', values[key][0].originFileObj);
        } else {
          formData.append(key, values[key]);
        }
      });

      if (editingUtilityBill) {
        await api.put(`/utility_bills/${editingUtilityBill.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const response = await api.post('/utility_bills/', values);
        if (values.image) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', values.image[0].originFileObj);
          await api.post(`/utility_bills/${response.data.id}/upload_image`, uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }
      fetchUtilityBills();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save utility bill', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        My Utility Bills
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Add Utility Bill
      </Button>
      <Grid container spacing={3}>
        {utilityBills.map((utilityBill) => (
          <Grid item xs={12} key={utilityBill.id}>
            <UtilityBillCard utilityBill={utilityBill} onEdit={() => handleEdit(utilityBill)} />
          </Grid>
        ))}
      </Grid>
      <UtilityBillForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        initialValues={editingUtilityBill}
      />
    </div>
  );
};

export default UtilityBillList;
