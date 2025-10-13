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
import styles from './AirQuality.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AirQuality = () => {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '축사 공기질 데이터',
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: '최고공기질',
        data: [450, 520, 480, 510, 490, 530, 500],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },

      {
        label: '평균공기질',
        data: [400, 420, 410, 430, 415, 440, 425],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },

      {
        label: '최저공기질',
        data: [350, 370, 360, 380, 365, 390, 375],
        borderColor: 'rgba(235, 53, 226, 1)',
        backgroundColor: 'rgba(114, 14, 109, 0.5)',
      },
    ],
  };

  // 더미 데이터 기반 통계
  const stats = {
    maxValue: '530.0',
    avgValue: '420.7',
    minValue: '350.0'
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            축사 공기질 데이터
          </h1>
        </div>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardMax}`}>
            <p className={styles.statLabel}>최고 공기질</p>
            <p className={`${styles.statValue} ${styles.statValueMax}`}>
              {stats.maxValue} ppm
            </p>
          </div>

          <div className={`${styles.statCard} ${styles.statCardAvg}`}>
            <p className={styles.statLabel}>평균 공기질</p>
            <p className={`${styles.statValue} ${styles.statValueAvg}`}>
              {stats.avgValue} ppm
            </p>
          </div>

          <div className={`${styles.statCard} ${styles.statCardMin}`}>
            <p className={styles.statLabel}>최저 공기질</p>
            <p className={`${styles.statValue} ${styles.statValueMin}`}>
              {stats.minValue} ppm
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

export default AirQuality
