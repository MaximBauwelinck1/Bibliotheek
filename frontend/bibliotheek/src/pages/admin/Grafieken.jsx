import AantalReservatiesChart from '../../components/grafieken/AantalReservatiesChart';
import * as styles from '../../css/Grafieken.module.css';
export default function Grafieken(){
  return (
    <div className={styles.charts_container}>
      <div className={styles.chart_item}>
        <AantalReservatiesChart />
      </div>
    </div>
  );
}