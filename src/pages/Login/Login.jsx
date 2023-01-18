import { Button, Paper, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Login.module.css';
import * as Yup from 'yup';
import { login } from '../../api/auth.api';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Email invalid'),
  password: Yup.string().min(4, 'Password too short'),
});

export default function Login() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async values => {
      const res = await login(values.email, values.password);
      if (res.status === 'success') {
        localStorage.setItem('token', res.token);
        navigate('/home');
      } else console.log('fuck');
    },
    validationSchema: loginSchema,
  });
  return (
    <Paper className={classes.formContainer} style={{}} elevation={3}>
      <h1>Login</h1>
      <TextField
        id='email'
        name='email'
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        type='email'
        label='Email'
        variant='filled'
      />
      <TextField
        id='password'
        name='password'
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        type='password'
        label='Password'
        variant='filled'
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
      <p style={{ textAlign: 'start' }}>
        No account, <Link to='/signup'>create one</Link>
      </p>
      <Button onClick={formik.handleSubmit} type='submit' variant='outlined'>
        Login
      </Button>
      <ToastContainer />
    </Paper>
  );
}
