import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TodoInput from '../components/TodoInput';
import TodoListPanel from '../components/TodoListPanel';
import SchedulePanel from '../components/SchedulePanel';
import CalendarPanel from '../components/CalendarPanel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, updateTodos } from '../reducers/todoSlice';
import {
  fetchScheduleByDate,
  addTodoToSchedule,
  reorderScheduleTodos,
  reorderTodosInSchedule,
} from '../reducers/schedulerSlice';

// Helper to format date as yyyy-MM-dd
const formatDate = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return null;
  return parsedDate.toISOString().split('T')[0];
};

const Home = () => {
  const todos = useSelector((state) => state.todos.todos);
  const schedules = useSelector((state) => state.schedules.schedules);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const dispatch = useDispatch();

  // Fetch todos and schedule for the selected date
  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchTodos());
      dispatch(fetchScheduleByDate(selectedDate));
    }
  }, [dispatch, selectedDate]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Reorder within TodoListPanel
    if (source.droppableId === 'todo-list' && destination.droppableId === 'todo-list') {
      const reorderedTodos = Array.from(todos);
      const [movedTodo] = reorderedTodos.splice(source.index, 1);
      reorderedTodos.splice(destination.index, 0, movedTodo);
      dispatch(updateTodos(reorderedTodos));
    }

    // Add a todo to SchedulePanel
    if (source.droppableId === 'todo-list' && destination.droppableId === 'schedule-panel') {
      const todo = todos[source.index];
      dispatch(addTodoToSchedule({ date: selectedDate, todo }));
    }

    // Reorder within SchedulePanel
    if (source.droppableId === 'schedule-panel' && destination.droppableId === 'schedule-panel') {
      const currentSchedule =
        schedules.find((schedule) => schedule.date === selectedDate)?.todos || [];
      const reorderedTodos = Array.from(currentSchedule);
      const [movedTodo] = reorderedTodos.splice(source.index, 1);
      reorderedTodos.splice(destination.index, 0, movedTodo);

      dispatch(reorderTodosInSchedule({ date: selectedDate, reorderedTodos }));
    }
  };

  const handleDateChange = (newDate) => {
    const formattedDate = formatDate(newDate);
    if (!formattedDate) {
      console.error('Invalid date selected:', newDate);
      return;
    }

    console.log('Selected date:', formattedDate);
    setSelectedDate(formattedDate);
    dispatch(fetchScheduleByDate(formattedDate));
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
