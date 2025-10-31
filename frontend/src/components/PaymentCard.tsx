import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const PaymentCard = ({ payment, onEdit }) => {
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
          Payment for Lease ID: {payment.lease_id}
        </Typography>
        <Typography color="textSecondary">
          Tenant ID: {payment.tenant_id}
        </Typography>
        <Typography>
          Amount: {formatCurrency(payment.amount)}
        </Typography>
        <Typography>
          Payment Date: {payment.payment_date}
        </Typography>
        <Typography>
          Payment Method: {payment.payment_method}
        </Typography>
        {payment.note_receipt_reference && (
          <Typography>
            Note/Receipt Reference: {payment.note_receipt_reference}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onEdit}>Edit</Button>
      </CardActions>
    </Card>
  );
};

export default PaymentCard;
