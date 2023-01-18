import { Button, Paper, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import { singup } from '../../api/auth.api';
import classes from './Signup.module.css';

const signupSchema = Yup.object().shape({
  id: Yup.string(),
  firstName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email('Email invalid'),
  password: Yup.string().min(4, 'Password too short'),
});

export default function Signup() {
  const formik = useFormik({
    initialValues: {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
    validationSchema: signupSchema,
    onSubmit: values => {
      singup(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
        values.id
      );
    },
  });
  return (
    <Paper className={classes.formContainer} style={{}} elevation={3}>
      <h1>Signup</h1>
      <TextField
        name='email'
        id='email'
        type='email'
        label='Email'
        variant='filled'
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      <TextField
        id='id'
        name='id'
        type='text'
        label='Student card ID'
        variant='filled'
        value={formik.values.id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.id && Boolean(formik.errors.id)}
        helperText={formik.touched.id && formik.errors.id}
      />
      <TextField
        name='firstName'
        id='firstName'
        type='text'
        label='First Name'
        variant='filled'
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
      />
      <TextField
        name='lastName'
        id='lastName'
        type='text'
        label='Last Name'
        variant='filled'
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
      />
      <TextField
        name='password'
        id='password'
        type='password'
        label='Password'
        variant='filled'
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
      <p style={{ textAlign: 'start' }}>
        <Link to='/login'> Already have an account?</Link>
      </p>
      <Button onClick={formik.handleSubmit} type='submit' variant='outlined'>
        Login
      </Button>
      <ToastContainer />
    </Paper>
  );
}
