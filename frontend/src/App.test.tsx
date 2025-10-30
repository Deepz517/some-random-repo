import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App.tsx';

test('renders welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to RentRoll/i);
  expect(linkElement).toBeInTheDocument();
});
