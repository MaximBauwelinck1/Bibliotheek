import axios from 'axios'; 

const baseUrl = 'http://localhost:9000/api';

export async function getAll(url) {
  const { data } = await axios.get(`${baseUrl}/${url}`); 

  return data.items;
}

export async function getById(url) {
  const { data } = await axios.get(`${baseUrl}/${url}`); 

  return data;
}
