import  { useRef,useEffect } from 'react';
import BoekListItem from './boekListItem'; 
import styles from '../../css/BoekSuggestie.module.css'; 

const SuggestionsBar = ({ suggestions }) => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = 'auto';
      const container = scrollContainerRef.current;
      const middlePosition = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = middlePosition;
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
    }
  }, []);
  return (
    <div className={styles.suggestions_container}>
      <button className={styles.scroll_button} onClick={scrollLeft}>
        &#9664; 
      </button>
      <div className={styles.scrollable_container} ref={scrollContainerRef}>
        {suggestions.map((suggestion) => (
          <BoekListItem key={suggestion.id} {...suggestion} />
        ))}
      </div>
      <button className={styles.scroll_button} onClick={scrollRight}>
        &#9654; 
      </button>
    </div>
  );
};

export default SuggestionsBar;
