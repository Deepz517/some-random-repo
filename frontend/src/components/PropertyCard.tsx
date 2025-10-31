import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const PropertyCard = ({ property, onEdit }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3">
          {property.name}
        </Typography>
        <Typography color="textSecondary">
          {property.address}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onEdit}>Edit</Button>
      </CardActions>
    </Card>
  );
};

export default PropertyCard;
