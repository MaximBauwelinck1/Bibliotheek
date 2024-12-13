import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
function LijnGrafiek({ chartData, titel, beschrijving }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: 'center' }}>{titel}</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: beschrijving,
            },
          },
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 7, 
              },
            },
            y: {
              beginAtZero: true, 
            },
          },
        }}
      />
    </div>
  );
}

export default LijnGrafiek;
