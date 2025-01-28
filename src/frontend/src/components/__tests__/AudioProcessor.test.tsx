import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioProcessor from '../AudioProcessor';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('AudioProcessor', () => {
  it('renders without crashing', () => {
    renderWithTheme(<AudioProcessor />);
    expect(screen.getByText('Audio Analysis & Processing')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    renderWithTheme(<AudioProcessor />);
    
    const file = new File(['audio content'], 'test.wav', { type: 'audio/wav' });
    const input = screen.getAllByAcceptingUpload()[0];

    await userEvent.upload(input, file);
    
    expect(input.files?.[0]).toBe(file);
  });

  it('analyzes audio file', async () => {
    renderWithTheme(<AudioProcessor />);
    
    const file = new File(['audio content'], 'test.wav', { type: 'audio/wav' });
    const input = screen.getAllByAcceptingUpload()[0];
    await userEvent.upload(input, file);

    const analyzeButton = screen.getByText('Analyze Track');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
      expect(screen.getByText(/Tempo: 120/)).toBeInTheDocument();
      expect(screen.getByText(/Key: C major/)).toBeInTheDocument();
    });
  });

  it('creates transition between two files', async () => {
    renderWithTheme(<AudioProcessor />);
    
    const file1 = new File(['audio1'], 'test1.wav', { type: 'audio/wav' });
    const file2 = new File(['audio2'], 'test2.wav', { type: 'audio/wav' });
    
    const [input1, input2] = screen.getAllByAcceptingUpload();
    await userEvent.upload(input1, file1);
    await userEvent.upload(input2, file2);

    const transitionButton = screen.getByText('Create Transition');
    fireEvent.click(transitionButton);

    await waitFor(() => {
      // Verify loading state and completion
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    server.use(
      rest.post('http://localhost:8000/analyze/track', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderWithTheme(<AudioProcessor />);
    
    const file = new File(['audio'], 'test.wav', { type: 'audio/wav' });
    const input = screen.getAllByAcceptingUpload()[0];
    await userEvent.upload(input, file);

    const analyzeButton = screen.getByText('Analyze Track');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to analyze audio')).toBeInTheDocument();
    });
  });
}); 