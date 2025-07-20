import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/api';

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useApi = <T = any>(url: string, options?: AxiosRequestConfig) => {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      const response = await axios(url, options);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error.response?.data?.error || 'An error occurred',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { ...state, refetch: fetchData };
};

export default useApi;
