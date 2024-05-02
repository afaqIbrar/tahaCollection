import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMediaQuery } from '@mui/material';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading, error }] = useLoginMutation();
  const { userInfo } = useSelector((store) => store.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/routing/dashboard');
    }
  }, [navigate, userInfo]);

  const isNonMobile = useMediaQuery('(min-width:600px)');
  const handleFormSubmit = async (values) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(`/routing/dashboard`);
      toast.success('Logged in Successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };
  const initialValues = {
    userName: '',
    password: ''
  };
  const loginSchema = yup.object().shape({
    userName: yup.string().required('Required'),
    password: yup.string().required('Required')
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box width={isNonMobile ? '400px' : '100%'} p={2}>
        <Header title="LOGIN" subtitle="Login to Your Account" />
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={loginSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit
          }) => (
            <form onSubmit={handleSubmit}>
              <Box display="grid" gap="20px">
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="User Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName}
                  name="userName"
                  error={!!touched.userName && !!errors.userName}
                  helperText={touched.userName && errors.userName}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="primary" variant="contained">
                  Login
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default LoginForm;
