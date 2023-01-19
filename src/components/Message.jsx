import React from 'react';
import classes from './Message.module.css';

export default function Message({ message }) {
  return (
    <div
      style={{ alignSelf: message.sent ? 'flex-end' : 'flex-start' }}
      className={classes.container}
    >
      {message.message}
    </div>
  );
}
