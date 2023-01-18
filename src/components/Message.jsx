import React from 'react';
import classes from './Message.module.css';

export default function Message({ message }) {
  return <div className={classes.container}>{message.data}</div>;
}
