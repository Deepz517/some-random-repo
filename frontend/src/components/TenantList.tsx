import { useEffect, useState } from 'react';
import api from '../services/api';
import TenantCard from './TenantCard';
import TenantForm from './TenantForm';
import { Grid, Typography, Button } from '@mui/material';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants/');
      setTenants(response.data);
    } catch (error) {
      console.error('Failed to fetch tenants', error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreate = () => {
    setEditingTenant(null);
    setIsModalVisible(true);
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingTenant) {
        await api.put(`/tenants/${editingTenant.id}`, values);
      } else {
        await api.post('/tenants/', values);
      }
      fetchTenants();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save tenant', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        My Tenants
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Add Tenant
      </Button>
      <Grid container spacing={3}>
        {tenants.map((tenant) => (
          <Grid item xs={12} sm={6} md={4} key={tenant.id}>
            <TenantCard tenant={tenant} onEdit={() => handleEdit(tenant)} />
          </Grid>
        ))}
      </Grid>
      <TenantForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        initialValues={editingTenant}
      />
    </div>
  );
};

export default TenantList;
