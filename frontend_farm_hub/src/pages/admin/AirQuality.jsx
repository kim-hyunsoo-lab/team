import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./AirQuality.module.css";
import axios from "axios";
import dayjs from "dayjs";
import Select from "../../common/Select";

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
  const [airQualityData, setAirQulaityData] = useState([]);

  const days = [];

  for (let i = 0; i < 28; i++) {
    days.push(i + 1);
  }

  //select 된 값에 따라 표시되는 값이 달라짐
  const [dateRange, setDateRange] = useState(days.slice(0, 7));

  useEffect(() => {
    axios
      .get("/api/farms/air-quality", { params: { each: dateRange } })
      .then((res) => {
        console.log(res.data);
        setAirQulaityData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [dateRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "축사 공기질 데이터",
      },
    },
  };

  const labels = airQualityData.map((e, i) => {
    return dayjs(e.createDate).format("YY-MM-DD");
  });

  const data = {
    labels,
    datasets: [
      {
        label: "최고 공기질",
        data: airQualityData.map((e, i) => {
          return e.maxAir;
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },

      {
        label: "평균 공기질",
        data: airQualityData.map((e, i) => {
          return e.avgAir;
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },

      {
        label: "최저 공기질",
        data: airQualityData.map((e, i) => {
          return e.minAir;
        }),
        borderColor: "rgba(235, 53, 226, 1)",
        backgroundColor: "rgba(114, 14, 109, 0.5)",
      },
    ],
  };

  // 실제 데이터 기반 통계 계산 (0인 데이터 제외)
  const calculateStats = () => {
    if (airQualityData.length === 0) {
      return {
        maxValue: "0.0",
        avgValue: "0.0",
        minValue: "0.0",
      };
    }

    // 0이 아닌 데이터만 필터링
    const validMaxData = airQualityData
      .filter((e) => e.maxAir > 0)
      .map((e) => e.maxAir);
    const validAvgData = airQualityData
      .filter((e) => e.avgAir > 0)
      .map((e) => e.avgAir);
    const validMinData = airQualityData
      .filter((e) => e.minAir > 0)
      .map((e) => e.minAir);

    // 선택한 기간 내 모든 maxAir 중 최댓값 (소수점 첫째자리)
    const maxValue =
      validMaxData.length > 0 ? Math.max(...validMaxData).toFixed(1) : "0.0";

    // 선택한 기간 내 모든 avgAir의 평균값 (소수점 첫째자리)
    const avgValue =
      validAvgData.length > 0
        ? (
            validAvgData.reduce((acc, e) => acc + e, 0) / validAvgData.length
          ).toFixed(1)
        : "0.0";

    // 선택한 기간 내 모든 minAir 중 최솟값 (소수점 첫째자리)
    const minValue =
      validMinData.length > 0 ? Math.min(...validMinData).toFixed(1) : "0.0";

    return { maxValue, avgValue, minValue };
  };

  const stats = calculateStats();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>축사 공기질 데이터</h1>
          <Select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
            }}
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
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

export default AirQuality;
