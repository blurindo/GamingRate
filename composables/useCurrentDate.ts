export function getCurrentFormattedDate() {
    const now = new Date();
  
    // Format date and time excluding milliseconds
    const formattedDateTime = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
  
    // Extract milliseconds and pad with zeros if necessary
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  
    // Construct the full formatted string
    // Replace '/' with '-' in the date part and ',' with '.' before milliseconds
    const formattedDate = formattedDateTime.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$3-$1-$2 $4:$5:$6') + '.' + milliseconds;
  
    return formattedDate;
  }