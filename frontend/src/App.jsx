import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1>🎉 Event Management</h1>
      {events.map(e => (
        <div key={e._id}>
          <h3>{e.name}</h3>
          <p>{e.date}</p>
          <p>{e.location}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
