import React, { useState} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TodoInput from '../components/TodoInput';
import TodoListPanel from '../components/TodoListPanel';
import SchedulePanel from '../components/SchedulePanel';
import CalendarPanel from '../components/CalendarPanel';
import { useDispatch, useSelector } from 'react-redux';
import { updateTodos } from '../reducers/todoSlice';
import {
  addTodoToSchedule,
  reorderScheduleTodos,
  addOrUpdateSchedule,
} from '../reducers/schedulerSlice';

const Home = () => {
  const todos = useSelector((state) => state.todos.todos);
  const schedules = useSelector((state) => state.schedules.schedules);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());

  const dispatch = useDispatch();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Reorder within TodoListPanel
    if (source.droppableId === 'todo-list' && destination.droppableId === 'todo-list') {
      const items = Array.from(todos);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      dispatch(updateTodos(items));
    }

    // Copy a todo to SchedulePanel
    if (source.droppableId === 'todo-list' && destination.droppableId === 'schedule-panel') {
      const todo = todos[source.index];
      dispatch(addTodoToSchedule({ date: selectedDate, todo }));
    }

    // Reorder within SchedulePanel
    if (source.droppableId === 'schedule-panel' && destination.droppableId === 'schedule-panel') {
      dispatch(
        reorderScheduleTodos({
          date: selectedDate,
          sourceIndex: source.index,
          destinationIndex: destination.index,
        })
      );
    }
  };

  const handleDateChange = (newDate) => {
    console.log('Selected date:', newDate);
    setSelectedDate(newDate);
  };


  return (
    <div className="container mt-5">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          <div className="col-md-4">
            <TodoInput />
            <TodoListPanel />
          </div>
          <div className="col-md-4">
            <SchedulePanel />
          </div>
          <div className="col-md-4">
            <CalendarPanel date={selectedDate} onDateChange={handleDateChange} />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Home;
