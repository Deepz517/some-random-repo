import { useEffect, useState } from 'react';
import api from '../services/api';
import LeaseCard from './LeaseCard';
import LeaseForm from './LeaseForm';
import { Grid, Typography, Button } from '@mui/material';

const LeaseList = () => {
  const [leases, setLeases] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLease, setEditingLease] = useState(null);

  const fetchLeases = async () => {
    try {
      const response = await api.get('/leases/');
      setLeases(response.data);
    } catch (error) {
      console.error('Failed to fetch leases', error);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleCreate = () => {
    setEditingLease(null);
    setIsModalVisible(true);
  };

  const handleEdit = (lease) => {
    setEditingLease(lease);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingLease) {
        await api.put(`/leases/${editingLease.id}`, values);
      } else {
        await api.post('/leases/', values);
      }
      fetchLeases();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save lease', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        My Leases
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Add Lease
      </Button>
      <Grid container spacing={3}>
        {leases.map((lease) => (
          <Grid item xs={12} key={lease.id}>
            <LeaseCard lease={lease} onEdit={() => handleEdit(lease)} />
          </Grid>
        ))}
      </Grid>
      <LeaseForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        initialValues={editingLease}
      />
    </div>
  );
};

export default LeaseList;
