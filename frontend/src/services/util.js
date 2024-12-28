// Helper function to validate and format dates
const formatDate = (date) => {
    if (!date) {
      console.error('Error formatting date: Date is null or undefined');
      return null;
    }
  
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
      if (isNaN(parsedDate.getTime())) {
        console.error('Error formatting date: Invalid date', date);
        return null;
      }
  
      return parsedDate.toISOString().split('T')[0]; // Format as yyyy-MM-dd
    } catch (error) {
      console.error('Unexpected error formatting date:', error);
      return null;
    }
  };

// Helper to get light flat colors based on todo type
const getTodoTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'office':
        return 'lightcoral'; // Lighter orange
      case 'personal':
        return 'lightgreen'; // Lighter green
      case 'learning':
        return 'lightblue'; // Lighter blue
      default:
        return 'lightgray'; // Default lighter gray for unknown types
    }
  };
  
  // Helper to get color gradient based on priority
 const getPriorityColor = (priority) => {
    if (priority === undefined || priority === null) return 'gray'; // Default color
  
    if (priority >= 1 && priority <= 10) {
      // Gradient from red (low priority) to blue (high priority)
      const percentage = (priority - 1) / 9; // Normalize to [0, 1]
      const red = Math.round((1 - percentage) * 255); // Decrease red
      const blue = Math.round(percentage * 255); // Increase blue
      return `rgb(${red}, 0, ${blue})`;
    }
  
    return 'gray'; // Gray for priority 11 or higher
  };
  

export { formatDate, getTodoTypeColor, getPriorityColor };