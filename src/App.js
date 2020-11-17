import { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Pusher from 'pusher-js';
import axios from './axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login';
import { useStateValue } from './StateProvider';

function App() {

  const [{ user }, dispatch] = useStateValue();
  const [messages, setMessages] = useState();

  useEffect(() => {
    axios.get('/messages')
      .then(response => {
        setMessages(response.data);
      });
  }, []);

  useEffect(() => {
    
    const pusher = new Pusher('71896e4509cd91bdad5f', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  }, [messages]);

  console.log(messages);

  return (
    <div className="app"> 
        { !user ? (
          <Login />
        ) : (
          <div className="app__body">
          <Router>
          <Sidebar />
          <Switch>
            <Route path="/rooms/:roomId">
              <Chat messages={messages} />
            </Route>
          </Switch>
          </Router>
          </div>  
        )}    
    </div>
  );
}

export default App;
