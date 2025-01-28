import { render, screen } from '@testing-library/react';
import Layout from '../Layout';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

describe('Layout', () => {
  it('renders children and header/footer', () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </ThemeProvider>
    );

    expect(screen.getByText('Music AI Platform')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('displays current year in footer', () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </ThemeProvider>
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });
}); 