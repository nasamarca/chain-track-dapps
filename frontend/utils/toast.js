import { toast } from 'react-hot-toast';

export const useThemeAwareToast = (isDark = false) => {
  const getToastStyles = (type) => ({
    style: {
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#ffffff' : '#1f2937',
      borderRadius: '10px',
      padding: '16px',
      boxShadow: isDark 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${
        type === 'success' ? '#22c55e' : 
        type === 'error' ? '#ef4444' : 
        type === 'loading' ? '#3b82f6' : '#6b7280'
      }`,
    },
    duration: type === 'loading' ? Infinity : 5000,
    position: 'top-right',
  });

  const messages = {
    transaction: {
      pending: 'Processing transaction...',
      sent: 'Transaction sent! Waiting for confirmation...',
      confirmed: 'Transaction confirmed successfully! 🎉',
      failed: 'Transaction failed. Please try again.',
      gasRetry: 'Retrying with higher gas limit...',
      gasFailed: 'Gas estimation failed. Please try again.',
    },
    product: {
      adding: 'Adding product to blockchain...',
      added: 'Product added successfully! 🎉',
      selling: 'Processing sale transaction...',
      sold: 'Product sold successfully! 🎉',
    },
    user: {
      adding: 'Adding new user...',
      added: 'User added successfully! 🎉',
      loading: 'Loading users list...',
      loadFailed: 'Failed to load users list.',
    },
    wallet: {
      connecting: 'Connecting to wallet...',
      connected: 'Wallet connected successfully!',
      required: 'Please connect your wallet first.',
      wrongNetwork: 'Please switch to the correct network.',
    },
    error: {
      default: 'An error occurred. Please try again.',
      validation: 'Please fill all required fields.',
    }
  };

  return {
    success: (message) => toast.success(message, getToastStyles('success')),
    error: (error) => {
      const message = error?.message || error?.reason || error || messages.error.default;
      return toast.error(message, getToastStyles('error'));
    },
    loading: (message) => toast.loading(message, getToastStyles('loading')),
    dismiss: toast.dismiss,
    messages
  };
};