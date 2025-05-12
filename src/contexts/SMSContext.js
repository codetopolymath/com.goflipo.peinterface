import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_FORM_DATA, DEFAULT_CONTACT, MESSAGE_TEMPLATES } from '../constants';
import { fetchScrubbingLogs, sendSMS, processBackupAPI } from '../services/apiService';

// Create context
const SMSContext = createContext();

// Context provider component
export const SMSProvider = ({ children }) => {
  // State
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [contacts, setContacts] = useState([DEFAULT_CONTACT]);
  const [response, setResponse] = useState({ loading: false, success: false, error: null, message: '' });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsContent, setDetailsContent] = useState(null);
  const [inputMode, setInputMode] = useState(0);
  const [bulkNumbers, setBulkNumbers] = useState('');
  const [corsError, setCorsError] = useState(false);
  const [apiMode, setApiMode] = useState('primary');
  const [messageType, setMessageType] = useState('SIMPLE MESSAGE');

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index].number = value;
    setContacts(updatedContacts);
  };

  const handleBulkNumbersChange = (e) => setBulkNumbers(e.target.value);

  const handleTabChange = (event, newValue) => {
    setInputMode(newValue);
    
    if (newValue === 0 && contacts.length > 0) {
      setContacts([contacts[0]]);
    }
    
    if (newValue === 1) {
      const numbersText = contacts.map(contact => contact.number).join('\n');
      setBulkNumbers(numbersText);
    }
  };

  const handleApiModeChange = (event, newMode) => {
    if (newMode !== null) {
      setApiMode(newMode);
      // Reset coverage for different modes
      if (newMode === 'backup') {
        setFormData(prev => ({ ...prev, coverage: '+91' }));
      } else {
        setFormData(prev => ({ ...prev, coverage: '91' }));
      }
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
    setBulkNumbers("9876543210\n8765432109\n7654321098\n6543210987\n5432109876");
  };

  const processBulkNumbers = () => {
    const numbers = bulkNumbers
      .split('\n')
      .map(num => num.trim())
      .filter(num => num.length > 0);
    
    if (numbers.length === 0) {
      setResponse({
        loading: false,
        success: false,
        error: "Please enter at least one phone number",
        message: "Please enter at least one phone number"
      });
      return false;
    }
    
    const newContacts = numbers.map(number => ({
      number,
      status: 'pending',
      result: null
    }));
    
    setContacts(newContacts);
    return true;
  };

  // Dialog actions
  const showDetails = (data) => {
    setDetailsContent(data);
    setDetailsOpen(true);
  };

  const closeDetails = () => setDetailsOpen(false);

  // Form actions
  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setContacts([DEFAULT_CONTACT]);
    setBulkNumbers('');
    setResponse({ loading: false, success: false, error: null, message: '' });
    setMessageType('SIMPLE MESSAGE');
  };

  // Process a single contact
  const processContact = async (contact, index) => {
    try {
      setContacts(prevContacts => {
        const updated = [...prevContacts];
        updated[index].status = 'processing';
        return updated;
      });
      
      if (apiMode === 'primary') {
        // Primary flow
        const scrubbingResponse = await fetchScrubbingLogs({
          ...formData,
          number: contact.number
        });
        
        if (scrubbingResponse.status && scrubbingResponse.data && scrubbingResponse.data.authcode) {
          const authcode = scrubbingResponse.data.authcode;
          const smsResponse = await sendSMS({
            ...formData,
            number: contact.number
          }, authcode);
          
          setContacts(prevContacts => {
            const updated = [...prevContacts];
            updated[index].status = 'success';
            updated[index].result = { scrubbing: scrubbingResponse, sms: smsResponse };
            return updated;
          });
          
          return true;
        } else {
          throw new Error('Failed to get valid authcode from scrubbing API');
        }
      } else {
        // Backup flow
        const payload = {
          senderid: formData.senderid,
          pe_id: formData.pe_id,
          number: contact.number,
          content_id: formData.content_id,
          message: formData.message
        };
        
        const backupResponse = await processBackupAPI(payload);
        
        setContacts(prevContacts => {
          const updated = [...prevContacts];
          updated[index].status = 'success';
          updated[index].result = backupResponse;
          return updated;
        });
        
        return true;
      }
    } catch (error) {
      if (error.message.includes('CORS')) {
        setCorsError(true);
      }
      
      setContacts(prevContacts => {
        const updated = [...prevContacts];
        updated[index].status = 'error';
        updated[index].error = error.message;
        return updated;
      });
      
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setCorsError(false);
    
    if (inputMode === 1) {
      const success = processBulkNumbers();
      if (!success) return;
    }
    
    const emptyContacts = contacts.filter(contact => !contact.number.trim());
    if (emptyContacts.length > 0) {
      setResponse({
        loading: false,
        success: false,
        error: "Please enter all contact numbers",
        message: "Please enter all contact numbers"
      });
      return;
    }
    
    setResponse({
      loading: true,
      success: false, 
      error: null,
      message: `Processing ${contacts.length} contact(s) using ${apiMode} mode...`
    });
    
    setContacts(prevContacts => prevContacts.map(contact => ({
      ...contact,
      status: 'pending',
      result: null,
      error: null
    })));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < contacts.length; i++) {
      if (corsError) break;
      
      const success = await processContact(contacts[i], i);
      if (success) {
        successCount++;
      } else {
        errorCount++;
        if (corsError) break;
      }
    }
    
    setResponse({
      loading: false,
      success: successCount > 0,
      error: corsError 
        ? 'CORS Error: Unable to access the API directly.' 
        : errorCount > 0 
          ? `Failed to send SMS to ${errorCount} contact(s)` 
          : null,
      message: corsError 
        ? 'CORS Error: Unable to access the API directly.'
        : `Successfully sent SMS to ${successCount} out of ${contacts.length} contact(s) using ${apiMode} mode`
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
    apiMode,
    messageType,
    MESSAGE_TEMPLATES,
    
    // Form handlers
    handleChange,
    handleContactChange,
    handleBulkNumbersChange,
    handleTabChange,
    handleApiModeChange,
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

// Custom hook to use the SMS context
export const useSMS = () => {
  const context = useContext(SMSContext);
  if (!context) {
    throw new Error('useSMS must be used within an SMSProvider');
  }
  return context;
};
