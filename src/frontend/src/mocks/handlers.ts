import { rest } from 'msw';

export const handlers = [
  // Analyze endpoint mock
  rest.post('http://localhost:8000/analyze/track', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        beats: [0.5, 1.0, 1.5, 2.0],
        key: 'C',
        scale: 'major',
        tempo: 120,
        energy: 0.8,
        spectral_centroid: 2000
      })
    );
  }),

  // Transition endpoint mock
  rest.post('http://localhost:8000/transition/create', async (req, res, ctx) => {
    // Mock audio blob response
    const audioBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
    return res(
      ctx.status(200),
      ctx.set('Content-Type', 'audio/wav'),
      ctx.body(audioBlob)
    );
  })
]; 