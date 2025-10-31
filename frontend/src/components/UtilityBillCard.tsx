import { Card, CardContent, Typography, CardActions, Button, CardMedia } from '@mui/material';

const UtilityBillCard = ({ utilityBill, onEdit }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleViewImage = () => {
    window.open(`http://localhost:8000/utility_bills/images/${utilityBill.image_url.split('/')[1]}`, '_blank');
  };

  return (
    <Card>
      {utilityBill.image_url && (
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:8000/utility_bills/images/${utilityBill.image_url.split('/')[1]}`}
          alt="Utility bill"
        />
      )}
      <CardContent>
        <Typography variant="h6" component="h3">
          {utilityBill.bill_type} for Lease ID: {utilityBill.lease_id}
        </Typography>
        <Typography color="textSecondary">
          Tenant ID: {utilityBill.tenant_id}
        </Typography>
        <Typography>
          Amount: {formatCurrency(utilityBill.amount)}
        </Typography>
        <Typography>
          Due Date: {utilityBill.due_date}
        </Typography>
        <Typography>
          Billing Period: {utilityBill.billing_period}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onEdit}>Edit</Button>
        {utilityBill.image_url && <Button size="small" onClick={handleViewImage}>View Image</Button>}
      </CardActions>
    </Card>
  );
};

export default UtilityBillCard;
