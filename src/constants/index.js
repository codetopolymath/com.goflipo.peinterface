// API URLs
export const PRIMARY_SCRUBBING_API = 'https://smartping-backend.goflipo.com/api/main/scrubbing-logs';
export const PRIMARY_SMS_API = 'https://relit.in/app/smsapisr/index.php';
export const BACKUP_API = 'http://localhost:5001/process-message';

// Default form values
export const DEFAULT_FORM_DATA = {
  coverage: '+91',
  routes: 'testr',
  senderid: 'SANJUP',
  pe_id: '1501550540000010698',
  content_id: '1507167577648640421',
  message: 'Thank you for showing interest, for more information please click on below link hello Sanjay'
};

// Message templates for backup mode
export const MESSAGE_TEMPLATES = {
  "SIMPLE MESSAGE": "Thank you for showing interest, for more information please click on below link hello Sanjay",
  "NORMAL URL": "Thank you for showing interest, for more information please click on below link http://urlmanager.duckdns.org/ Sanjay",
  "TAMPERED MESSAGE": "Thank you for showing interest, for more information please click on below link http://urlmanager.duckdsn.org/ Sanjay",
  "TRUSTED URL": "Thank you for showing interest, for more information please click on below link https://www.docker.com/ Sanjay",
  "TRUSTED URL WITH EXTENSION": "Thank you for showing interest, for more information please click on below link https://www.docker.com/hello Sanjay",
  "CALLBACK NUMBER": "Thank you for showing interest, for more information please click on below link 8459188977 Sanjay",
  "OTP": "Thank you for showing interest, for more information please click on below link 123456 Sanjay"
};

// Default contact
export const DEFAULT_CONTACT = { number: '8459188977', status: 'pending', result: null };
