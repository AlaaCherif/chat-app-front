import { Button, Paper, TextField } from '@mui/material';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import Message from '../../components/Message';
import {
  decrypt,
  encrypt,
  genKeys,
  getPublicKey,
} from '../../services/crypto.service';
import classes from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [buttonPressed, setbuttonPressed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [publicKey, setPublicKey] = useState();

  const fetchPublicKey = () => {
    getPublicKey(email).then(res => {
      console.log(res.data);
      setPublicKey(res.data);
    });
  };

  const emitMessage = () => {
    const toSend = JSON.stringify({
      user: email,
      data: encrypt(message, publicKey),
    });
    setMessages(prev => [...prev, { message, sent: true }]);
    socket.emit('data', toSend);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    setUser(jwtDecode(token));
    genKeys();
  }, []);
  useEffect(() => {
    const socket = io('localhost:5001/', {
      auth: {
        token: localStorage.getItem('token'),
        pubkey: localStorage.getItem('publicKey'),
      },
      transports: ['websocket'],
      cors: {
        origin: 'http://localhost:3000/',
      },
    });
    console.log('this is hte socket', socket);
    setSocket(socket);
    socket.on('connect', data => {
      console.log(data);
    });

    socket.on('disconnect', data => {
      console.log(data);
    });
    socket.on('data', data => {
      setMessages(prev => [
        ...prev,
        { message: decrypt(data.data), sent: false },
      ]);
    });
    return function cleanup() {
      socket.disconnect();
    };
  }, []);

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
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Button onClick={fetchPublicKey} color='secondary'>
          Chat !
        </Button>
      </div>
      {messages && messages.length > 0 && (
        <div className={classes.messageContainer}>
          {messages.map(item => (
            <Message key={Math.random()} message={item} />
          ))}
        </div>
      )}
      {publicKey && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
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
      )}
    </Paper>
  );
}
