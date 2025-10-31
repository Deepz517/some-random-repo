import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const TenantCard = ({ tenant, onEdit }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3">
          {tenant.full_name}
        </Typography>
        <Typography color="textSecondary">
          {tenant.email}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onEdit}>Edit</Button>
      </CardActions>
    </Card>
  );
};

export default TenantCard;
