// server.js - Proxy server for PE Interface
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 5001);

const isDevelopment = process.env.NODE_ENV !== 'production';

const corsOptions = isDevelopment
  ? {
      origin: true,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      optionsSuccessStatus: 204
    }
  : {
      origin: [
        'http://peinterface.goflipo.in',
        'https://peinterface.goflipo.in',
        'http://localhost:3000',
        'http://64.227.156.167',
        'http://64.227.156.167:3000',
        'http://64.227.156.167:5001',
        'http://64.227.156.167:5002'
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true
    };

app.use(cors(corsOptions));
app.use(express.json());

// Environment-based API URL configuration
const SCRUBBING_URLS = {
  demo: 'https://stage-smartping-backend.goflipo.com/api/main/scrubbing-logs',
  production: 'https://central-be.goflipo.com/api/main/scrubbing-logs'
};

const PROCESS_VERIFY_URL = 'http://143.110.242.221:8080/process-verify';

// Text to Hex conversion utility
const textToHex = (text) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    result += charCode.toString(16).padStart(4, '0');
  }
  return result;
};

// Main endpoint — scrubbing + verify flow
app.post('/process-message', async (req, res) => {
  const payload = req.body;
  const VALID_ENVS = ['demo', 'production'];
  const environment = VALID_ENVS.includes(payload.environment) ? payload.environment : 'demo';

  const requiredFields = ['senderid', 'pe_id', 'number', 'content_id', 'message'];
  const missingFields = requiredFields.filter(field => !payload[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  const scrubbingUrl = SCRUBBING_URLS[environment] || SCRUBBING_URLS.demo;
  console.log(`[${environment.toUpperCase()}] Starting process-message for number: ${payload.number}`);
  console.log(`[${environment.toUpperCase()}] Step 1: Calling scrubbing-logs at ${scrubbingUrl}`);

  try {
    // Step 1: Call scrubbing-logs (INIT-API)
    const initResponse = await axios.post(
      scrubbingUrl,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const initData = initResponse.data;
    console.log(`[${environment.toUpperCase()}] Step 1: Response received, status: ${initData.status}`);

    if (!initData.status) {
      console.error(`[${environment.toUpperCase()}] Step 1: scrubbing-logs failed:`, initData);
      return res.status(500).json({
        error: 'Scrubbing API call failed',
        details: initData
      });
    }

    // Step 2: Prepare verify payload
    const authcode = initData.data.authcode;
    console.log(`[${environment.toUpperCase()}] Step 2: Authcode received: ${authcode}`);

    const messageHex = textToHex(payload.message);

    const verifyPayload = {
      authcode,
      senderid: payload.senderid,
      pe_id: payload.pe_id,
      number: payload.number,
      content_id: payload.content_id,
      message_hex: messageHex,
      environment  // forward environment so process-verify picks the right verify URL
    };

    // Step 3: Call process-verify wrapper
    console.log(`[${environment.toUpperCase()}] Step 3: Calling process-verify at ${PROCESS_VERIFY_URL}`);
    const verifyResponse = await axios.post(
      PROCESS_VERIFY_URL,
      verifyPayload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const verifyResult = verifyResponse.data;
    console.log(`[${environment.toUpperCase()}] Step 3: Verify response received`);

    console.log(`[${environment.toUpperCase()}] Success! Returning combined results`);
    return res.json({
      init_response: initData,
      verify_response: verifyResult
    });

  } catch (error) {
    console.error(`[${environment.toUpperCase()}] Error:`, error.message);
    console.error(`[${environment.toUpperCase()}] Details:`, {
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
  app.use(express.static(path.join(__dirname, '..', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'} mode)`);
  console.log(`Access the application at http://localhost:${PORT}`);
});
