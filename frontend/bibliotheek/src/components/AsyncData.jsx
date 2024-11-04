// src/components/AsyncData.jsx
import Loader from './Loader'; 
import Error from './Error'; 

export default function AsyncData({
  loading, 
  error, 
  children, 
}) {
  
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      {children} 
    </>
  );
}
