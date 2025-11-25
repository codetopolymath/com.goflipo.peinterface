// server.js - Enhanced proxy server to handle CORS and backup mode
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5002;
const BACKUP_PORT = process.env.BACKUP_PORT || 5001;

// Enable CORS for all requests
// In development, allow all origins. In production, use whitelist.
const isDevelopment = process.env.NODE_ENV !== 'production';

var corsOptions = isDevelopment
  ? {
      origin: true, // Allow all origins in development
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      optionsSuccessStatus: 204
    }
  : {
      origin: [
        "http://peinterface.goflipo.in",
        "https://peinterface.goflipo.in",
        "http://localhost:3000",
        "http://64.227.156.167",
        "http://64.227.156.167:3000",
        "http://64.227.156.167:5001",
        "http://64.227.156.167:5002"
      ],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true
    }

app.use(cors(corsOptions));
app.use(express.json());

// Proxy endpoint for scrubbing logs API
app.get('/api/scrubbing-logs', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    const response = await axios.get(
      `https://stage-smartping-backend.goflipo.com/api/main/scrubbing-logs?${params.toString()}`
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

// Text to Hex conversion utility (equivalent to Python's text_to_hex)
const textToHex = (text) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    result += charCode.toString(16).padStart(4, '0');
  }
  return result;
};

// Backup mode endpoint (equivalent to Python's process-message)
app.post('/process-message', async (req, res) => {
  // Get payload from the API request
  const payload = req.body;

  // Validate required fields
  const requiredFields = ['senderid', 'pe_id', 'number', 'content_id', 'message'];
  const missingFields = requiredFields.filter(field => !payload[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  try {
    console.log('[BACKUP MODE] Starting process-message for number:', payload.number);

    // Step 1: Call INIT-API (Scrubbing Logs)
    console.log('[BACKUP MODE] Step 1: Calling INIT-API (scrubbing-logs)...');
    const initResponse = await axios.post(
      'https://stage-smartping-backend.goflipo.com/api/main/scrubbing-logs',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // 30 second timeout
      }
    );

    const initData = initResponse.data;
    console.log('[BACKUP MODE] Step 1: INIT-API response received, status:', initData.status);

    // Check if the call was successful
    if (!initData.status) {
      console.error('[BACKUP MODE] Step 1: INIT-API call failed:', initData);
      return res.status(500).json({
        error: 'INIT-API call failed',
        details: initData
      });
    }

    // Step 2: Get authcode and prepare for server call
    const authcode = initData.data.authcode;
    console.log('[BACKUP MODE] Step 2: Authcode received:', authcode);

    // Convert message to hex for VERIFY-API
    const messageHex = textToHex(payload.message);

    // Step 3: Call server API for verification
    const serverPayload = {
      authcode: authcode,
      senderid: payload.senderid,
      pe_id: payload.pe_id,
      number: payload.number,
      content_id: payload.content_id,
      message_hex: messageHex
    };

    const serverUrl = 'http://143.110.242.221:8080/process-verify';
    console.log('[BACKUP MODE] Step 3: Calling VERIFY-API at', serverUrl);
    const serverResponse = await axios.post(
      serverUrl,
      serverPayload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // 30 second timeout
      }
    );

    const verifyResult = serverResponse.data;
    console.log('[BACKUP MODE] Step 3: VERIFY-API response received, status:', verifyResult.status);

    // Return the combined results
    console.log('[BACKUP MODE] Success! Returning combined results');
    return res.json({
      init_response: initData,
      verify_response: verifyResult
    });
  } catch (error) {
    console.error('[BACKUP MODE] Error occurred:', error.message);
    console.error('[BACKUP MODE] Error details:', {
      code: error.code,
      response_status: error.response?.status,
      response_data: error.response?.data
    });

    return res.status(500).json({
      error: error.message,
      error_code: error.code,
      details: error.response?.data || null
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Build folder is at the root level, not in client folder
  app.use(express.static(path.join(__dirname, '..', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
}

// Start both the main server and the backup server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Main server running on port ${PORT}`);
});

// Also listen on the backup port for compatibility with existing code
app.listen(BACKUP_PORT, '0.0.0.0', () => {
  console.log(`Backup server running on port ${BACKUP_PORT}`);
});
