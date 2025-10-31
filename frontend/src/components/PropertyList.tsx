import { useEffect, useState } from 'react';
import api from '../services/api';
import PropertyCard from './PropertyCard';
import PropertyForm from './PropertyForm';
import { Grid, Typography, Button } from '@mui/material';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties/');
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleCreate = () => {
    setEditingProperty(null);
    setIsModalVisible(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingProperty) {
        await api.put(`/properties/${editingProperty.id}`, values);
      } else {
        await api.post('/properties/', values);
      }
      fetchProperties();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save property', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        My Properties
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Add Property
      </Button>
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <PropertyCard property={property} onEdit={() => handleEdit(property)} />
          </Grid>
        ))}
      </Grid>
      <PropertyForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        initialValues={editingProperty}
      />
    </div>
  );
};

export default PropertyList;
