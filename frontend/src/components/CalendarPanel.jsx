import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { Row, Col, Card } from 'react-bootstrap';
import Calendar from 'react-calendar'; // Import react-calendar
import { formatDate } from '../services/util'; // Import formatDate helper function

// Helper function to validate dates
const isValidDate = (date) => date instanceof Date && !isNaN(date);

// Helper function to get the system's timezone
const getSystemTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone; // Fetch system timezone
};

const CalendarPanel = ({ date, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(
    isValidDate(new Date(date)) ? new Date(date) : new Date()
  );

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate); // Update local state
    if (onDateChange) {
      onDateChange(formatDate(newDate)); // Pass the formatted date to the parent
    }
  };

  const timezone = getSystemTimezone();

  return (
    <Card className="p-3">
      <h5 className="text-center">Calendar</h5>
      <Row className="mb-3">
        <Col>
          <strong>Selected Date:</strong> {formatDate(selectedDate)}
        </Col>
        <Col>
          <strong>Day of the Week:</strong>{' '}
          {selectedDate.toLocaleDateString('en-AU', { weekday: 'long' })}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <strong>Timezone:</strong> {timezone}
        </Col>
      </Row>
      <div className="d-flex justify-content-center">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="react-calendar-custom" // Custom class for additional styling
          tileClassName="text-center text-dark" // Custom tile style
        />
      </div>
    </Card>
  );
};

export default CalendarPanel;
