// API endpoint
export const BACKUP_API = '/process-message';

// Environment identifiers
export const ENVIRONMENTS = {
  DEMO: 'demo',
  PRODUCTION: 'production'
};

export const DEFAULT_ENVIRONMENT = 'demo';

// Default form values
export const DEFAULT_FORM_DATA = {
  coverage: '+91',
  routes: 'testr',
  senderid: 'SANJUP',
  pe_id: '1501550540000010698',
  content_id: '1507167577648640421',
  message: 'Thank you for showing interest, for more information please click on below link hello Sanjay'
};

// Message templates
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
