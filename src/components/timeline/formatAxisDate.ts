export const formatAxisDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { day: '??', month: '???', time: 'Invalid' };
    }
  
    return {
      day: new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date),
      month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
      time: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date),
    };
  };
  