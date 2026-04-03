import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_FORM_DATA, DEFAULT_CONTACT, MESSAGE_TEMPLATES, DEFAULT_ENVIRONMENT } from '../constants';
import { processBackupAPI } from '../services/apiService';

const SMSContext = createContext();

export const SMSProvider = ({ children }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [contacts, setContacts] = useState([DEFAULT_CONTACT]);
  const [response, setResponse] = useState({ loading: false, success: false, error: null, message: '' });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsContent, setDetailsContent] = useState(null);
  const [inputMode, setInputMode] = useState(0);
  const [bulkNumbers, setBulkNumbers] = useState('');
  const [corsError, setCorsError] = useState(false);
  const [environment, setEnvironment] = useState(DEFAULT_ENVIRONMENT);
  const [messageType, setMessageType] = useState('SIMPLE MESSAGE');

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, value) => {
    setContacts(prev => prev.map((c, i) => i === index ? { ...c, number: value } : c));
  };

  const handleBulkNumbersChange = (e) => setBulkNumbers(e.target.value);

  const handleTabChange = (event, newValue) => {
    setInputMode(newValue);

    if (newValue === 0 && contacts.length > 0) {
      // Reset status when switching back to single entry so stale indicators don't show
      setContacts([{ ...contacts[0], status: 'pending', result: null, error: null }]);
    }

    if (newValue === 1) {
      const numbersText = contacts.map(contact => contact.number).join('\n');
      setBulkNumbers(numbersText);
    }
  };

  const handleEnvironmentChange = (event, newEnv) => {
    if (newEnv !== null) {
      setEnvironment(newEnv);
    }
  };

  const handleMessageTypeChange = (e) => {
    const newType = e.target.value;
    setMessageType(newType);
    setFormData(prev => ({ ...prev, message: MESSAGE_TEMPLATES[newType] }));
  };

  // Contact actions
  const addContact = () => setContacts(prev => [...prev, { number: '', status: 'pending', result: null }]);

  const removeContact = (index) => {
    if (contacts.length > 1) {
      setContacts(prev => prev.filter((_, i) => i !== index));
    }
  };

  const generateSampleNumbers = () => {
    setBulkNumbers('9876543210\n8765432109\n7654321098\n6543210987\n5432109876');
  };

  // Returns parsed contacts array, or null if invalid
  const parseBulkNumbers = () => {
    const numbers = bulkNumbers
      .split('\n')
      .map(num => num.trim())
      .filter(num => num.length > 0);

    if (numbers.length === 0) {
      setResponse({
        loading: false,
        success: false,
        error: 'Please enter at least one phone number',
        message: 'Please enter at least one phone number'
      });
      return null;
    }

    const newContacts = numbers.map(number => ({ number, status: 'pending', result: null }));
    setContacts(newContacts);
    return newContacts;
  };

  // Dialog actions
  const showDetails = (data) => {
    setDetailsContent(data);
    setDetailsOpen(true);
  };

  const closeDetails = () => setDetailsOpen(false);

  // Form reset
  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setContacts([DEFAULT_CONTACT]);
    setBulkNumbers('');
    setInputMode(0);
    setCorsError(false);
    setResponse({ loading: false, success: false, error: null, message: '' });
    setMessageType('SIMPLE MESSAGE');
  };

  // Process a single contact — returns { success, isCorsError }
  const processContact = async (contact, index, localEnv) => {
    setContacts(prev => prev.map((c, i) => i === index ? { ...c, status: 'processing' } : c));

    try {
      const payload = {
        senderid: formData.senderid,
        pe_id: formData.pe_id,
        number: contact.number,
        content_id: formData.content_id,
        message: formData.message,
        environment: localEnv
      };

      const backupResponse = await processBackupAPI(payload);

      setContacts(prev => prev.map((c, i) =>
        i === index ? { ...c, status: 'success', result: backupResponse, error: null } : c
      ));

      return { success: true, isCorsError: false };
    } catch (error) {
      const isCorsError = error.message.includes('CORS') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError');

      if (isCorsError) {
        setCorsError(true);
      }

      setContacts(prev => prev.map((c, i) =>
        i === index ? { ...c, status: 'error', error: error.message } : c
      ));

      return { success: false, isCorsError };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCorsError(false);

    let activeContacts = contacts;

    if (inputMode === 1) {
      const parsed = parseBulkNumbers();
      if (!parsed) return;
      activeContacts = parsed;
    }

    const emptyContacts = activeContacts.filter(c => !c.number.trim());
    if (emptyContacts.length > 0) {
      setResponse({
        loading: false,
        success: false,
        error: 'Please enter all contact numbers',
        message: 'Please enter all contact numbers'
      });
      return;
    }

    setResponse({
      loading: true,
      success: false,
      error: null,
      message: `Processing ${activeContacts.length} contact(s)...`
    });

    setContacts(activeContacts.map(c => ({ ...c, status: 'pending', result: null, error: null })));

    let successCount = 0;
    let errorCount = 0;
    let localCorsError = false;

    for (let i = 0; i < activeContacts.length; i++) {
      if (localCorsError) break;

      const { success, isCorsError } = await processContact(activeContacts[i], i, environment);

      if (isCorsError) {
        localCorsError = true;
        break;
      }

      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    setResponse({
      loading: false,
      success: successCount > 0,
      error: localCorsError
        ? 'CORS Error: Unable to access the API directly.'
        : errorCount > 0
          ? `Failed to send to ${errorCount} contact(s)`
          : null,
      message: localCorsError
        ? 'CORS Error: Unable to access the API directly.'
        : `Successfully processed ${successCount} out of ${activeContacts.length} contact(s) [${environment}]`
    });
  };

  const contextValue = {
    // State
    formData,
    contacts,
    response,
    detailsOpen,
    detailsContent,
    inputMode,
    bulkNumbers,
    corsError,
    environment,
    messageType,
    MESSAGE_TEMPLATES,

    // Handlers
    handleChange,
    handleContactChange,
    handleBulkNumbersChange,
    handleTabChange,
    handleEnvironmentChange,
    handleMessageTypeChange,

    // Contact actions
    addContact,
    removeContact,
    generateSampleNumbers,

    // Dialog actions
    showDetails,
    closeDetails,

    // Form actions
    resetForm,
    handleSubmit
  };

  return (
    <SMSContext.Provider value={contextValue}>
      {children}
    </SMSContext.Provider>
  );
};

export const useSMS = () => {
  const context = useContext(SMSContext);
  if (!context) {
    throw new Error('useSMS must be used within an SMSProvider');
  }
  return context;
};
