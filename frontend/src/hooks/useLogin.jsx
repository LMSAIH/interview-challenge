import { useState } from 'react';
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const useLogIn = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
   
      const response = await axios.post('http://localhost:4000/api/v1/login', { email, password });
      console.log(response);

      const userData = response.data;

      localStorage.setItem('user', JSON.stringify(userData));
      dispatch({ type: 'LOGIN', payload: userData });

      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setIsLoading(false);

      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); 
      } else {
        setError('An error occurred. Please try again.');
      }

      console.error(err);
    }
  };

  return { login, error, isLoading };
};
