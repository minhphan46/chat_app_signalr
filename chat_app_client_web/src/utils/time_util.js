export const formatTime = (isoDateString) => {
  try {
    const date = new Date(isoDateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};
