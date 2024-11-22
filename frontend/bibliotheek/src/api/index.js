import axios from 'axios'; 

const baseUrl = import.meta.env.VITE_API_URL;

export async function getAll(url) {
  const { data } = await axios.get(`${baseUrl}/${url}`); 
  return data.items;
}

export async function getById(url) {
  const { data } = await axios.get(`${baseUrl}/${url}`); 

  return data;
}

export const deleteById = async (url, { arg: id }) => {
  await axios.delete(`${baseUrl}/${url}/${id}`); 
};

export const save = async (url, { arg: { id, ...data } }) => {
  console.log('tesfffffffffff');
  await axios({
    method: id ? 'PUT' : 'POST',
    url: `${baseUrl}/${url}/${id ?? ''}`,
    data:data.values,
  });
};

export const deleteRandomBeschikbaarExemplaar = async (url,{ arg: id }) => {
  console.log(id);
  await axios.delete(`${baseUrl}/${url}/${id.id}/deletebeschikbaarkopie`); 
};