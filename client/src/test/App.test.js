import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('does not render learn react link', () => {
  const testMessage = "learn react";
  render(<App>{testMessage}</App>);

  expect(screen.queryByText(testMessage)).toBeNull();
});