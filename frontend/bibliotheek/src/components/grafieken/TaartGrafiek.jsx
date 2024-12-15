import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
function TaartGrafiek({ chartData, titel, beschrijving }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: 'center' }}>{titel}</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: beschrijving,
            },
          },
        }}
      />
    </div>
  );
}

export default TaartGrafiek;
