import React from 'react';
import Calendar from 'react-calendar';

const isValidDate = (date) => date instanceof Date && !isNaN(date);

const CalendarPanel = ({ date, onDateChange }) => {
  const selectedDate = isValidDate(new Date(date)) ? new Date(date) : new Date();

  const handleDateChange = (newDate) => {
    onDateChange(newDate.toISOString());
  };

  return (
    <div>
      <h5>Calendar</h5>
      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => handleDateChange(new Date(e.target.value))}
      />
    </div>
  );
};
  
  export default CalendarPanel;
  