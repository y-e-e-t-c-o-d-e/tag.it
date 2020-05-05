import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

test('shows the home title when rendered', () => {
    render(<Home></Home>);
    expect(screen.queryByText("Home")).toBeInTheDocument();
});