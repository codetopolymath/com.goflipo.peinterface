// server.js - Simple proxy server to handle CORS
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5002;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

// Proxy endpoint for scrubbing logs API
app.get('/api/scrubbing-logs', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    const response = await axios.get(
      `https://smartping-backend.goflipo.com/api/main/scrubbing-logs?${params.toString()}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      status: false,
      message: `Proxy error: ${error.message}`,
      error: error.response?.data || null
    });
  }
});

// Proxy endpoint for SMS API
app.get('/api/send-sms', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    const response = await axios.get(
      `https://relit.in/app/smsapisr/index.php?${params.toString()}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      status: false,
      message: `Proxy error: ${error.message}`,
      error: error.response?.data || null
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});