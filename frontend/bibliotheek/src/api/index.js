import axiosRoot from 'axios'; 
import { JWT_TOKEN_KEY } from '../contexts/Auth.context';
const baseUrl = import.meta.env.VITE_API_URL;

export const axios = axiosRoot.create({
  baseURL: baseUrl,
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});
axios.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Check if the response status is 401
    if (error.response?.status === 401) {
      // Redirect to the login page
    //  window.location.href = '/test';
    }
    // Reject the promise with the error object for other errors
    return Promise.reject(error);
  },
);
export async function getAll(url) {
  const { data } = await axios.get(url); 
  return data.items;
}

export async function getById(url) {
  const { data } = await axios.get(url); 

  return data;
}

export const deleteById = async (url, { arg: id }) => {
  await axios.delete(`${url}/${id}`); 
};

export const save = async (url, { arg: { id, ...data } }) => {
  await axios({
    method: id ? 'PUT' : 'POST',
    url: `${url}/${id ?? ''}`,
    data:data.values,
  });
};

export const deleteRandomBeschikbaarExemplaar = async (url,{ arg: id }) => {
  await axios.delete(`${url}/${id.id}/beschikbaarkopie`); 
};

export const post = async (url, { arg }) => {
  const { data } = await axios.post(`${url}`, arg);
  return data;
};