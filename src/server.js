import app from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Scale API running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${config.nodeEnv}`);
});
