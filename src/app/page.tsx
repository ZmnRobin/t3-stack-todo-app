import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const [title, setTitle] = useState("");
  const utils = api.useContext();

  // Fetch todos
  const { data: todos, isLoading } = api.todo.getAll.useQuery();

  // Create todo
  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate(); // Refresh todos
      setTitle(""); // Clear input
    },
  });

  // Toggle completion
  const toggleComplete = api.todo.toggleComplete.useMutation({
    onSuccess: () => utils.todo.getAll.invalidate(),
  });

  // Delete todo
  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => utils.todo.getAll.invalidate(),
  });

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Todo App</h1>

      {/* Create Todo */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="New Todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => createTodo.mutate({ title })}
          disabled={createTodo.isLoading}
        >
          Add
        </button>
      </div>

      {/* Display Todos */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="w-full max-w-md">
          {todos?.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span
                className={`cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""}`}
                onClick={() => toggleComplete.mutate({ id: todo.id })}
              >
                {todo.title}
              </span>
              <button
                className="text-red-500"
                onClick={() => deleteTodo.mutate({ id: todo.id })}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
