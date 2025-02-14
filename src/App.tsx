import React from "react";
import TodoList from "./components/TodoList";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <TodoList />
    </div>
  );
};

export default App;
