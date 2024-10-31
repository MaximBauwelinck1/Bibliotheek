import axios from 'axios'; 

const baseUrl = 'http://localhost:9000/api/boeken';

// 👇 3
export const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data.items;
};
