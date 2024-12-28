import React, { useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchScheduleByDate, reorderTodosInSchedule } from '../reducers/schedulerSlice';
import { formatDate, getTodoTypeColor } from '../services/util';

const SchedulePanel = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const schedules = useSelector((state) => state.schedules.schedules);

  const formattedSelectedDate = formatDate(selectedDate);

  const currentSchedule =
    schedules.find((schedule) => schedule.date === formattedSelectedDate)?.scheduledTodos || [];

  // Sort by `orderOfExecution` before rendering
  const sortedSchedule = [...currentSchedule].sort(
    (a, b) => (a.orderOfExecution || 0) - (b.orderOfExecution || 0)
  );

  useEffect(() => {
    if (formattedSelectedDate) {
      dispatch(fetchScheduleByDate(formattedSelectedDate));
    }
  }, [dispatch, formattedSelectedDate]);

  const handleDragEnd = (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;

    const { source, destination } = result;

    // Reorder the items locally
    const reorderedScheduledTodos = Array.from(sortedSchedule);
    const [movedTodo] = reorderedScheduledTodos.splice(source.index, 1);
    reorderedScheduledTodos.splice(destination.index, 0, movedTodo);

    // Update the `orderOfExecution`
    const updatedScheduledTodos = reorderedScheduledTodos.map((item, index) => ({
      ...item,
      orderOfExecution: index + 1,
    }));

    // Dispatch updated list to the backend
    dispatch(
      reorderTodosInSchedule({
        date: formattedSelectedDate,
        reorderedTodos: updatedScheduledTodos,
      })
    );
  };

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
          {sortedSchedule.length > 0 ? (
            sortedSchedule.map(({ id, todo, orderOfExecution }, index) => (
              <Draggable
                key={id}
                draggableId={`schedule-${id}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="border-bottom p-2 mb-2"
                    style={{
                      backgroundColor: getTodoTypeColor(todo.type),
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      ...provided.draggableProps.style,
                    }}
                  >
                    <div>
                      <strong>Order of Execution: {orderOfExecution}</strong>
                    </div>
                    <div>{todo.text}</div>
                    <div className="text-muted small">
                      Priority Order: {todo.priorityOrder} | Type: {todo.type || 'General'}
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
