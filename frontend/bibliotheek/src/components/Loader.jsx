export default function Loader() {
  return (
    <div className='d-flex flex-column align-items-center'>
      <div className='spinner-border'>
        <span className='visually-hidden' data-cy='loading'>Loading...</span>
      </div>
    </div>
  );
}