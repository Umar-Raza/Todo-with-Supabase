import { useEffect, useState } from 'react'
import './App.css'
import supabase from './config/supabase-client'

function App() {
  const [todoList, setTodoList] = useState([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoading, setIsLoading] = useState(true);

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false
    }

    const { data, error } = await supabase.from("TodoList").insert([newTodoData]).select().single();
    if (error) {
      console.log("Error during create todo!", error);
    } else {
      setTodoList((prev) => [...prev, data]);
      setNewTodo("");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("TodoList").select("*");
    if (error) {
      console.log("Something went wrong during get todo", error);
    } else {
      setTodoList(data || []); // Ensure data is an array, even if null
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const completeTask = async (id, isCompleted) => {
    const { data, error } = await supabase.from("TodoList").update({ isCompleted: !isCompleted }).eq("id", id);
    if (error) {
      console.log("Error during update task", error);
    } else {
      const updatedTodoList = todoList.map((todo) => todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo);
      setTodoList(updatedTodoList);
    }
  };

  const deleteTodo = async (id) => {
    const { data, error } = await supabase.from("TodoList").delete().eq("id", id);
    if (error) {
      console.log("Error during delete", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <>
      <div className="container mx-auto w-100">
        <div className="card w-100 flex shadow-sm mt-11">
          <h1 className='text-4xl text-center'>Add Task</h1>
          <input 
            type="text" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
            className='input w-full my-3' 
            placeholder='Your Task...' 
          />
          <button onClick={addTodo} className="btn btn-accent btn-outline">Add Task</button>
        </div>
        <br />
        <div className="card w-100">
          {isLoading ? (
            <p className='text-center'>Loading...</p>
          ) : (
            <table className="table">
              <tbody>
                {
                  todoList.map((todo) => (
                    <tr key={todo.id}>
                      <td>{todo.name}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-info" 
                          onClick={() => completeTask(todo.id, todo.isCompleted)}>
                          {todo.isCompleted ? "undo" : "Completed Task"}
                        </button>
                      </td>
                      <td>
                        <button 
                          className='btn btn-sm btn-error' 
                          onClick={() => deleteTodo(todo.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default App;