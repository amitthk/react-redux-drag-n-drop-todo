import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';

const SchedulePanel = () => {
  const schedules = useSelector((state) => state.schedules.schedules);
  const selectedDate = useSelector((state) => state.todos.selectedDate);

  const currentSchedule =
    schedules.find((schedule) => schedule.date === selectedDate)?.todos || [];

  return (
    <Droppable droppableId="schedule-panel">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="border p-3"
          style={{ minHeight: '200px', borderRadius: '5px' }}
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
                    {todo.text}
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
