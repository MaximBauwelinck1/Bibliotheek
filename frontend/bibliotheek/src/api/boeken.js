import axios from 'axios'; 

const baseUrl = 'http://localhost:9000/api/boeken';

// 👇 3
export const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data.items;
};

export const getById = async (id) => {
  const response = await axios.get(baseUrl.concat('/'+id));
  return response.data.items;
};
