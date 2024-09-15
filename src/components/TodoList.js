import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import "./style.css";
import addSound from "./sounds/add.mp3";
import deleteSound from "./sounds/delete.mp3";
import completeSound from "./sounds/complete.mp3";

function TodoList() {
  const [todo, settodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newTodoIndex, setNewTodoIndex] = useState(null);
  const [removingIndex, setRemovingIndex] = useState(null);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (todo.trim() === "") return;
    const newTodos = [...todos, { text: todo, completed: false }];
    setTodos(newTodos);
    settodo("");
    setNewTodoIndex(newTodos.length - 1);
    playSound(addSound);
  };

  const deleteTodo = (index) => {
    setRemovingIndex(index);
    playSound(deleteSound);
    setTimeout(() => {
      setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
      setRemovingIndex(null);
    }, 500);
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditValue(todos[index].text);
  };

  const saveEdit = () => {
    const updatedTodos = todos.map((item, index) =>
      index === editIndex ? { ...item, text: editValue } : item
    );
    setTodos(updatedTodos);
    setEditIndex(null);
    setEditValue("");
  };

  const toggleComplete = (index) => {
    const updatedTodos = todos.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setTodos(updatedTodos);
    playSound(completeSound);
  };

  return (
    <div className="app-container">
      <h1>What’s on your list today?</h1>

      <div className="input-button-container">
        <input
          type="text"
          placeholder="Add a new todo"
          value={todo}
          onChange={(e) => settodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {todos.map((item, index) => (
        <div
          key={index}
          className={`todo-item ${item.completed ? "completed" : ""} ${
            index === newTodoIndex ? "fade-in" : ""
          } ${index === removingIndex ? "fade-out" : ""}`}
          onAnimationEnd={() => {
            if (index === removingIndex) {
              setRemovingIndex(null);
            }
          }}
        >
          {editIndex === index ? (
            <>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <button className="save-btn" onClick={saveEdit}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setEditIndex(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <span>{item.text}</span>
              <div>
                <button
                  className="icon-button"
                  onClick={() => startEditing(index)}
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-button"
                  onClick={() => deleteTodo(index)}
                >
                  <FaTrash />
                </button>
                <button
                  className="icon-button"
                  onClick={() => toggleComplete(index)}
                >
                  <FaCheck />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TodoList;
