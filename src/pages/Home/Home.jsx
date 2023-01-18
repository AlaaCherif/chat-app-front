import { Button, Paper, TextField } from '@mui/material';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import Message from '../../components/Message';
import classes from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [buttonPressed, setbuttonPressed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [message, setMessage] = useState('');
  const emitMessage = () => {
    socket.emit('data', message);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    setUser(jwtDecode(token));
  }, []);
  useEffect(() => {
    if (buttonPressed === true) {
      const socket = io('localhost:5001/', {
        transports: ['websocket'],
        cors: {
          origin: 'http://localhost:3000/',
        },
      });
      setSocket(socket);
      socket.on('connect', data => {
        console.log(data);
      });

      socket.on('disconnect', data => {
        console.log(data);
      });
      socket.on('data', data => {
        setMessages(prev => [...prev, data]);
      });
      return function cleanup() {
        socket.disconnect();
      };
    }
  }, [buttonPressed]);

  return (
    <Paper
      style={{ display: 'flex', flexDirection: 'column' }}
      className={classes.container}
    >
      <h1>Welcome,</h1>
      <h2>{user && user.user}</h2>
      <h2>Start a conversation !</h2>
      <h3>Type your friend's email</h3>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          label='email'
          palceholder='friend@email.insat'
          variant='filled'
        />
        <Button
          onClick={() => setbuttonPressed(prev => true)}
          color='secondary'
        >
          Chat !
        </Button>
      </div>
      <div className={classes.messageContainer}>
        {messages &&
          messages.map(item => <Message key={Math.random()} message={item} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          label='Message'
          palceholder='friend@email.insat'
          variant='filled'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <Button onClick={emitMessage} color='secondary'>
          Send Message
        </Button>
      </div>
    </Paper>
  );
}
