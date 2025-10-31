import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../services/api';

const OverdueStatusBreakdown = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/analytics/overdue_status_breakdown');
        setData(response.data.overdue_status_breakdown);
      } catch (error) {
        console.error('Failed to fetch overdue status breakdown', error);
      }
    };

    fetchData();
  }, []);

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
      <Bar dataKey="total_amount" fill="#82ca9d" />
    </BarChart>
  );
};

export default OverdueStatusBreakdown;
