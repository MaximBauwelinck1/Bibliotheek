import TaartGrafiek from './TaartGrafiek';
import { useMemo } from 'react';
import useSWR from 'swr';
import * as API from '../../api/index';
import AsyncData from '../AsyncData';

export default function PopulaireBoekenChart() {
  const {
    data: reservaties = [],
    isLoading,
    error,
  } = useSWR('reservaties', API.getAll);

  const chartData = useMemo(() => {
    const aantal = reservaties.reduce((map, res) => {
      const title = res.boek_kopie.boek.titel;
      map.set(title, (map.get(title) || 0) + 1);
      return map;
    }, new Map());
    const labels =[...aantal].map(([key]) => key);
    let data = [...aantal].map(([key, value]) => value);
    return {
      labels,
      datasets: [
        {
          label: 'aantal gereserveerd',
          data,
          backgroundColor: [
            'rgba(75,192,192,1)',
            '#ecf0f1',
            '#50AF95',
            '#f3ba2f',
            '#2a71d0',
          ],
          borderColor: 'black',
          borderWidth: 2,
        },
      ],
    };
    
  }, [reservaties]);

  return (
    <div>
      <AsyncData loading={isLoading} error={error}>
        <TaartGrafiek
          titel="Populairste boeken"
          beschrijving="Boeken die het meest gereserveerd worden"
          chartData={chartData}
        />
      </AsyncData>
    </div>
  );
}
