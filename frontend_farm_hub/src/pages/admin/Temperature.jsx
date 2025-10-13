import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Temperature = () => {
  
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    axios.get('/api/farms/temperature', {params : {each : [0,1,2,3,4,5,6]}})
    .then(res => {
      console.log(res.data);
      setTemperatureData(res.data)
    })
    .catch(e => {
      console.log(e);
    });
  }, [])


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  const labels = temperatureData.map((e, i) => {return(dayjs(e.createDate).format('YY-MM-DD'))})

  const data = {
    labels,
    datasets: [
      {
        label: '최고온도',
        data: temperatureData.map((e, i) => {return(e.maxTemp)}),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },

      {
        label: '평균온도',
        data: temperatureData.map((e, i) => {return(e.avgTemp)}),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },

      {
        label: '최저온도',
        data: temperatureData.map((e, i) => {return(e.minTemp)}),
        borderColor: 'rgba(235, 53, 226, 1)',
        backgroundColor: 'rgba(114, 14, 109, 0.5)',
      },
    ],
  };

  return (
    <div>
      <Line 
        options={options}
        data={data}
      />
    </div>
  )
}

export default Temperature