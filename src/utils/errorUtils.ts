export const getErrorMessage = (error: any, fallback: string): string => {
  if (!error) {
    return fallback;
  }

  const responseData = error.response?.data ?? error.message;

  if (!responseData) {
    return fallback;
  }

  if (typeof responseData === 'string') {
    return responseData;
  }

  if (typeof responseData === 'object') {
    if (typeof responseData.message === 'string' && responseData.message.trim().length > 0) {
      return responseData.message;
    }
    if (typeof responseData.error === 'string' && responseData.error.trim().length > 0) {
      return responseData.error;
    }
  }

  return fallback;
};

