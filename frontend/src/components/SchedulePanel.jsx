import React, { useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchScheduleByDate } from '../reducers/schedulerSlice';

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


const SchedulePanel = () => {
  const dispatch = useDispatch();
  const schedules = useSelector((state) => state.schedules.schedules);
  const selectedDate = useSelector((state) => state.todos.selectedDate) || new Date().toISOString();

  // Format selectedDate and handle invalid cases
  const formattedSelectedDate = formatDate(selectedDate);

  if (!formattedSelectedDate) {
    console.error('Formatted date is invalid:', selectedDate);
  }

  // Find the schedule for the selected date
  const currentSchedule =
    schedules.find((schedule) => schedule.date === formattedSelectedDate)?.todos || [];

  useEffect(() => {
    if (formattedSelectedDate) {
      dispatch(fetchScheduleByDate(formattedSelectedDate));
    }
  }, [dispatch, formattedSelectedDate]);

  return (
    <Droppable droppableId="schedule-panel">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="border p-3"
          style={{ minHeight: '200px', borderRadius: '5px', backgroundColor: '#ffffff' }}
        >
          <h5>Day's Schedule</h5>
          {currentSchedule.length > 0 ? (
            currentSchedule.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="border-bottom p-2 mb-2"
                    style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                    }}
                  >
                    <div>
                      <strong>Priority: {todo.priorityOrder}</strong>
                    </div>
                    <div>{todo.text}</div>
                    <div className="text-muted small">
                      Type: {todo.type || 'General'}
                    </div>
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <div className="text-center text-muted">No items scheduled</div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default SchedulePanel;
