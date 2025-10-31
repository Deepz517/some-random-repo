import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const LeaseCard = ({ lease, onEdit }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3">
          Lease for Property ID: {lease.property_id}
        </Typography>
        <Typography color="textSecondary">
          Tenant ID: {lease.tenant_id}
        </Typography>
        <Typography>
          Rent: {formatCurrency(lease.rent_amount)}
        </Typography>
        <Typography>
          Start Date: {lease.start_date}
        </Typography>
        <Typography>
          End Date: {lease.end_date}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onEdit}>Edit</Button>
      </CardActions>
    </Card>
  );
};

export default LeaseCard;
