export const getColorForUsername = (username) => {
  if (!colorMap.has(username)) {
    // Generate a random color
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colorMap.set(username, color);
  }
  return colorMap.get(username);
};

const colorMap = new Map();
