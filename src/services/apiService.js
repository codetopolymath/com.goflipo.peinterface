import { PRIMARY_SCRUBBING_API, PRIMARY_SMS_API, BACKUP_API } from '../constants';

export const fetchScrubbingLogs = async (data) => {
  try {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      params.append(key, value);
    });

    const response = await fetch(`${PRIMARY_SCRUBBING_API}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Scrubbing API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError') || 
        error.message.includes('CORS')) {
      throw new Error('CORS Error: Unable to access the API directly from the browser.');
    }
    throw error;
  }
};

export const sendSMS = async (data, authcode) => {
  try {
    const params = new URLSearchParams({
      key: '566321AF6EB69D',
      campaign: '245',
      routeid: data.routes,
      type: 'text',
      contacts: data.number,
      peid: data.pe_id,
      cid: data.content_id,
      contentid: data.content_id,
      senderid: data.senderid,
      authcode: authcode,
      msg: data.message
    });

    const response = await fetch(`${PRIMARY_SMS_API}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.status}`);
    }

    const textResponse = await response.text();
    
    if (textResponse.startsWith('SMS-SHOOT-ID')) {
      return {
        success: true,
        smsShootId: textResponse,
        rawResponse: textResponse
      };
    } else {
      try {
        return JSON.parse(textResponse);
      } catch (e) {
        return {
          success: true,
          rawResponse: textResponse
        };
      }
    }
  } catch (error) {
    if (error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError') || 
        error.message.includes('CORS')) {
      throw new Error('CORS Error: Unable to access the API directly from the browser.');
    }
    throw error;
  }
};

export const processBackupAPI = async (payload) => {
  try {
    const response = await fetch(BACKUP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Backup API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
