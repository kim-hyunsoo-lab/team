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
import Select from '../../common/Select';
import styles from './Temperature.module.css';


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

  //축사 온도 데이터를 받을 state 변수
  const [temperatureData, setTemperatureData] = useState([]);

  const days = [];

  for (let i = 0; i < 28; i++) {
    days.push(i + 1);
  }

  //select 된 값에 따라 표시되는 값이 달라짐
  const [dateRange, setDateRange] = useState(days.slice(0,7));

  useEffect(() => {
    axios.get('/api/farms/temperature', {params : {each : dateRange}})
    .then(res => {
      console.log(res.data);
      setTemperatureData(res.data)
    })
    .catch(e => {
      console.log(e);
    });
  }, [dateRange])


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

  const labels = temperatureData.map((e) => {return(dayjs(e.createDate).format('YY-MM-DD'))})

  const data = {
    labels,
    datasets: [
      {
        label: '최고온도',
        data: temperatureData.map((e) => {return(e.maxTemp)}),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },

      {
        label: '평균온도',
        data: temperatureData.map((e) => {return(e.avgTemp)}),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },

      {
        label: '최저온도',
        data: temperatureData.map((e) => {return(e.minTemp)}),
        borderColor: 'rgba(235, 53, 226, 1)',
        backgroundColor: 'rgba(114, 14, 109, 0.5)',
      },
    ],
  };

  // 선택한 기간의 통계 계산 (0인 데이터 제외)
  const calculateStats = () => {
    if (temperatureData.length === 0) {
      return {
        maxValue: 0,
        avgValue: 0,
        minValue: 0
      };
    }

    // 0이 아닌 데이터만 필터링
    const validMaxData = temperatureData.filter(e => e.maxTemp > 0).map(e => e.maxTemp);
    const validAvgData = temperatureData.filter(e => e.avgTemp > 0).map(e => e.avgTemp);
    const validMinData = temperatureData.filter(e => e.minTemp > 0).map(e => e.minTemp);

    // 선택한 기간 내 모든 maxTemp 중 최댓값 (소수점 첫째자리)
    const maxValue = validMaxData.length > 0 ?
      Math.max(...validMaxData).toFixed(1) : '0.0';

    // 선택한 기간 내 모든 avgTemp의 평균값 (소수점 첫째자리)
    const avgValue = validAvgData.length > 0 ?
      (validAvgData.reduce((acc, e) => acc + e, 0) / validAvgData.length).toFixed(1) : '0.0';

    // 선택한 기간 내 모든 minTemp 중 최솟값 (소수점 첫째자리)
    const minValue = validMinData.length > 0 ?
      Math.min(...validMinData).toFixed(1) : '0.0';

    return { maxValue, avgValue, minValue };
  };

  const stats = calculateStats();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            축사 온도 데이터
          </h1>
          <Select
            value={dateRange}
            onChange={e => {setDateRange(e.target.value)}}
            className={styles.select}
          >
            <option value={days.slice(0, 7)}>1주전</option>
            <option value={days.slice(0, 14)}>2주전</option>
            <option value={days.slice(0, 21)}>3주전</option>
            <option value={days.slice(0, 28)}>4주전</option>
          </Select>
        </div>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardMax}`}>
            <p className={styles.statLabel}>최고 온도</p>
            <p className={`${styles.statValue} ${styles.statValueMax}`}>
              {temperatureData.length > 0 ?
                `${stats.maxValue} °C` :
                '- °C'}
            </p>
          </div>

          <div className={`${styles.statCard} ${styles.statCardAvg}`}>
            <p className={styles.statLabel}>평균 온도</p>
            <p className={`${styles.statValue} ${styles.statValueAvg}`}>
              {temperatureData.length > 0 ?
                `${stats.avgValue} °C` :
                '- °C'}
            </p>
          </div>

          <div className={`${styles.statCard} ${styles.statCardMin}`}>
            <p className={styles.statLabel}>최저 온도</p>
            <p className={`${styles.statValue} ${styles.statValueMin}`}>
              {temperatureData.length > 0 ?
                `${stats.minValue} °C` :
                '- °C'}
            </p>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <Line
            options={options}
            data={data}
          />
        </div>
      </div>

    <div>
      <Select value={dateRange} onChange={e => {
        setDateRange(e.target.value);
      }}>
        <option value={days.slice(0,7)}>1주전</option>
        <option value={days.slice(0,14)}>2주전</option>
        <option value={days.slice(0,21)}>3주전</option>
        <option value={days.slice(0,28)}>4주전</option>
      </Select>
      <Line 
        options={options}
        data={data}
      />
    </div>
  )
}

export default Temperature