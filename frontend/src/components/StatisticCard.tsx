import { Card, CardContent, Typography } from '@mui/material';

const StatisticCard = ({ title, value, color }) => {
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="h2" style={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
