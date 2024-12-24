import React from 'react';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { Row, Col, Card } from 'react-bootstrap';
import Calendar from 'react-calendar'; // Calendar component from 'react-calendar'

const isValidDate = (date) => date instanceof Date && !isNaN(date);

const CalendarPanel = ({ date, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(
    isValidDate(new Date(date)) ? new Date(date) : new Date()
  );

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate); // Update local state
    if (onDateChange) {
      onDateChange(newDate.toISOString()); // Call the onDateChange callback
    }
  };

  return (
    <Card className="p-3">
      <h5>Calendar</h5>
      <Row className="mb-3">
        <Col>
          <strong>Selected Date:</strong> {selectedDate.toISOString().split('T')[0]}
        </Col>
        <Col>
          <strong>Day of the Week:</strong> {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
        </Col>
      </Row>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName="text-center" // Center the numbers in tiles
      />
    </Card>
  );
};

export default CalendarPanel;
