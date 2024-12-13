import LijnGrafiek from './LijnGrafiek';
import { useMemo } from 'react';
import useSWR from 'swr';
import * as API from '../../api/index';
import AsyncData from '../AsyncData';
import moment from 'moment';

const datum_opties = { year: 'numeric', month: 'numeric', day: 'numeric' };

export default function AantalReservatiesChart() {
  const {
    data: reservaties = [],
    isLoading,
    error,
  } = useSWR('reservaties', API.getAll);

  const chartData = useMemo(() => {
    const vandaag = moment(); 
    const week = [...Array(7).keys()].map((i) => {
      const date = moment(vandaag).subtract(i, 'days');
      return date.format('YYYY-MM-DD');
    }).reverse(); // laatste 7 dagen maken

    //map het aantal keer dat een datum voor komt samen
    const counts = reservaties.reduce((acc, { startdatum }) => {
      const formattedDate = moment(new Date(startdatum)).format('YYYY-MM-DD');
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    }, {});
  
    //maakt de labels voor x as
    const labels = week.map((date) =>
      new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(date)),
    );
    //maakt de data voor de y as
    const data = week.map((date) => counts[date] || 0); 

    return {
      labels,
      datasets: [
        {
          label: 'Aantal Reservaties',
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
        <LijnGrafiek
          titel="Aantal reservaties"
          beschrijving="Aantal reservaties afgelopen week"
          chartData={chartData}
        />
      </AsyncData>
    </div>
  );
}
