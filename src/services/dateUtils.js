export const parseApiDate = (dateString) => {
  if (!dateString) return null;
  try {
    return new Date(dateString);
  } catch {
    const formats = [
      "yyyy-MM-dd'T'HH:mm:ss.SSS",
      "yyyy-MM-dd'T'HH:mm:ss'Z'",
      "yyyy-MM-dd'T'HH:mm:ss"
    ];
    for (let format of formats) {
      const parsed = Date.parse(dateString);
      if (!isNaN(parsed)) return new Date(parsed);
    }
    console.warn('Error parsing date:', dateString);
    return null;
  }
};
