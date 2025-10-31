import { useEffect, useState } from 'react';
import api from '../services/api';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const LeaseExpiryTimeline = () => {
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const response = await api.get('/leases/expiring');
        setLeases(response.data);
      } catch (error) {
        console.error('Failed to fetch expiring leases', error);
      }
    };

    fetchLeases();
  }, []);

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Lease Expiry Timeline
      </Typography>
      <List>
        {leases.map((lease) => (
          <ListItem key={lease.id}>
            <ListItemText
              primary={`Lease for Property ID: ${lease.property_id}`}
              secondary={`Expires on: ${lease.end_date}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default LeaseExpiryTimeline;
