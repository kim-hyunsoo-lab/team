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
import styles from './Illuminance.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Illuminance = () => {

  //축사 조도 데이터를 받을 state 변수
  const [illuminanceData, setIlluminanceData] = useState([]);

  const days = [];

  for (let i = 0; i < 28; i++) {
    days.push(i + 1);
  }

  //select 된 값에 따라 표시되는 값이 달라짐
  const [dateRange, setDateRange] = useState(days.slice(0,7));

  //마운트 시 데이터를 조회
  useEffect(() => {
    axios.get('/api/farms/illuminance', {params : {each : dateRange}})
    .then(res => {
      console.log(res.data);
      setIlluminanceData(res.data)
    })
    .catch(e => {
      console.log(e)
    });
  }, [dateRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '축사 조도 데이터',
      },
    },
  };

  const labels = illuminanceData.map((e) => {return(dayjs(e.createDate).format('YY-MM-DD'))})

  const data = {
    labels,
    datasets: [
      {
        label: '최고조도',
        data: illuminanceData.map((e) => {return(e.maxIll)}),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },

      {
        label: '평균조도',
        data: illuminanceData.map((e) => {return(e.avgIll)}),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },

      {
        label: '최저조도',
        data: illuminanceData.map((e) => {return(e.minIll)}),
        borderColor: 'rgba(235, 53, 226, 1)',
        backgroundColor: 'rgba(114, 14, 109, 0.5)',
      },
    ],
  };

  // 선택한 기간의 통계 계산 (0인 데이터 제외)
  const calculateStats = () => {
    if (illuminanceData.length === 0) {
      return {
        maxValue: 0,
        avgValue: 0,
        minValue: 0
      };
    }

    // 0이 아닌 데이터만 필터링
    const validMaxData = illuminanceData.filter(e => e.maxIll > 0).map(e => e.maxIll);
    const validAvgData = illuminanceData.filter(e => e.avgIll > 0).map(e => e.avgIll);
    const validMinData = illuminanceData.filter(e => e.minIll > 0).map(e => e.minIll);

    // 선택한 기간 내 모든 maxIll 중 최댓값
    const maxValue = validMaxData.length > 0 ?
      Math.max(...validMaxData) : 0;

    // 선택한 기간 내 모든 avgIll의 평균값
    const avgValue = validAvgData.length > 0 ?
      Math.round(validAvgData.reduce((acc, e) => acc + e, 0) / validAvgData.length) : 0;

    // 선택한 기간 내 모든 minIll 중 최솟값
    const minValue = validMinData.length > 0 ?
      Math.min(...validMinData) : 0;

    return { maxValue, avgValue, minValue };
  };

  const stats = calculateStats();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            축사 조도 데이터
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
            <p className={styles.statLabel}>최고 조도</p>
            <p className={`${styles.statValue} ${styles.statValueMax}`}>
              {illuminanceData.length > 0 ?
                `${stats.maxValue} lux` :
                '- lux'}
            </p>
          </div>

          <div className={`${styles.statCard} ${styles.statCardAvg}`}>
            <p className={styles.statLabel}>평균 조도</p>
            <p className={`${styles.statValue} ${styles.statValueAvg}`}>
              {illuminanceData.length > 0 ?
                `${stats.avgValue} lux` :
                '- lux'}
            </p>
          </div>

          <div className={`${styles.statCard} ${styles.statCardMin}`}>
            <p className={styles.statLabel}>최저 조도</p>
            <p className={`${styles.statValue} ${styles.statValueMin}`}>
              {illuminanceData.length > 0 ?
                `${stats.minValue} lux` :
                '- lux'}
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
    </div>
  )
}

export default Illuminance