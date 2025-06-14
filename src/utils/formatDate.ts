// Helper function to format dates consistently for the route service
export function formatDateForRouteService(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    // Format: YYYY-MM-DD HH:MM:SS
    return date.toISOString().replace('T', ' ').split('.')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original on error
  }
}