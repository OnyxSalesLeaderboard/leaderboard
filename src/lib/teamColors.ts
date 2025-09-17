// Team color mapping utility
export const getTeamColor = (teamName: string): string => {
  // Predefined colors for common teams (you can customize these)
  const predefinedColors: { [key: string]: string } = {
    'SALES': '#FF6B6B',
    'MARKETING': '#4ECDC4', 
    'DEVELOPMENT': '#45B7D1',
    'DESIGN': '#96CEB4',
    'OPERATIONS': '#FFEAA7',
    'FINANCE': '#DDA0DD',
    'HR': '#98D8C8',
    'SUPPORT': '#F7DC6F',
    'PRODUCT': '#BB8FCE',
    'ENGINEERING': '#85C1E9',
  };

  // Check if team has a predefined color
  const upperTeamName = teamName.toUpperCase();
  if (predefinedColors[upperTeamName]) {
    return predefinedColors[upperTeamName];
  }

  // Generate consistent color based on team name hash
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to HSL color for better color distribution
  const hue = Math.abs(hash) % 360;
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 50 + (Math.abs(hash) % 15); // 50-65%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Get a list of predefined team colors for reference
export const getPredefinedTeams = () => {
  return {
    'SALES': '#FF6B6B',
    'MARKETING': '#4ECDC4', 
    'DEVELOPMENT': '#45B7D1',
    'DESIGN': '#96CEB4',
    'OPERATIONS': '#FFEAA7',
    'FINANCE': '#DDA0DD',
    'HR': '#98D8C8',
    'SUPPORT': '#F7DC6F',
    'PRODUCT': '#BB8FCE',
    'ENGINEERING': '#85C1E9',
  };
};
