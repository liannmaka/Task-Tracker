import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import { useState, useEffect} from "react";
import { BrowserRouter as Router , Route, Switch} from "react-router-dom";


function App() {
  const [showTask, setShowTask] = useState(false)
  const [tasks, setTask] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getTasks = async () => {
        const taskFromServer = await fetchTasks()
        setTask(taskFromServer)
        setIsLoading(false)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/tasks')

      if(!res.ok) {
        throw new Error(`Failed to fetch tasks. Status: ${res.status}`)
      }

      const data = await res.json()

      return data 
    } catch(err) {
      setError(err.message)
    }
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)

    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {

    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTask([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    setTask(tasks.filter(task => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const toggleReminder = await fetchTask(id)

    const updReminder = {...toggleReminder, reminder: !toggleReminder.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updReminder)
  })

    const data = await res.json()

    setTask(tasks.map(task => task.id === id ? {...task, reminder: data.reminder} : task))
  }


  return (
    <Router>
      <div className="container">
        <Header title="Task Tracker" onAdd={() => setShowTask(!showTask)} showTask={showTask}/>
          {error && <div>{error}</div>}
          {isLoading && <div>Loading...</div>}
          <Switch>
            <Route path="/" exact render={() => (
              <>
                {showTask && <AddTask onAdd={addTask}/>}
                { !error && tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 'No Task Available'}
              </>
            )}/>
            <Route path="/about" component={About}/>
          </Switch>
        <Footer/>
      </div>
    </Router>               
  );
}

export default App;
