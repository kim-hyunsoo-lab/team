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
import Select from '../../common/Select';

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
    axios.get('/api/farms/test', {params : {each : [0,1,2,3,4,5,6]}})
    .then(res => {
      console.log(res.data);
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
        text: '축사 온도 데이터',
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: '최고온도',
        data: [10, 20, 30, 40, 50, 60, 70],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },

      {
        label: '평균온도',
        data: [70, 60, 50, 40, 30, 20, 10],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },

      {
        label: '최저온도',
        data: [77, 90, 63, 42, 31, 30, 16],
        borderColor: 'rgba(235, 53, 226, 1)',
        backgroundColor: 'rgba(114, 14, 109, 0.5)',
      },
    ],
  };

  return (
    <div>
      <Select>
        <option>1주전</option>
        <option>2주전</option>
        <option>3주전</option>
        <option>4주전</option>
      </Select>
      <Line 
        options={options}
        data={data}
      />
    </div>
  )
}

export default Temperature