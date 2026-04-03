import React, { memo } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const CompactSendWithTemplate = () => {
  const { response } = useSMS();

  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      startIcon={response.loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
      disabled={response.loading}
      sx={{
        px: 4,
        py: 1,
        boxShadow: 2,
        minWidth: 140
      }}
    >
      {response.loading ? 'Processing...' : 'Send'}
    </Button>
  );
};

export default memo(CompactSendWithTemplate);
