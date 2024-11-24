// "2024-11-23" to "2024-11-23T00:00:00Z"
export const adjustDateToNepalTimezone = (date) => {
  let formattedDate = "";
  if (typeof date === "string") {
    date = new Date(date);
    formattedDate = new Date(
      date.toISOString().replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/, "T00:00:00Z")
    );
    // formattedDate.setDate(formattedDate.getDate() + 1)
    return formattedDate;
  }
  const nepalOffsetMinutes = 5 * 60 + 45;
  const utcOffsetMinutes = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + utcOffsetMinutes + nepalOffsetMinutes);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

// Check if the string is exactly 24 characters long and contains only hexadecimal characters
export const isHexadecimalString = (str) => {
  return /^[a-fA-F0-9]{24}$/.test(str);
};

// "2024-11-23T18:40:12.602Z" to "2024-11-24"
export const formatDateToNepal = (date) => {
  // Calculate the Nepal timezone offset (5 hours 45 minutes)
  const nepalOffset = 5.75 * 60 * 60 * 1000; // Convert to milliseconds
  
  // Adjust the date for Nepal time zone
  const nepalDate = new Date(date.getTime() + nepalOffset);

  // Format the date to YYYY-MM-DD
  const year = nepalDate.getUTCFullYear();
  const month = String(nepalDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(nepalDate.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}