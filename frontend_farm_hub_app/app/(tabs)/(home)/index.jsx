import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import axios from "axios";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeScreen = () => {

  //축사 온도 데이터를 받을 state 변수
  const [temperatureData, setTemperatureData] = useState([]);

  const days = [];

  for (let i = 0; i < 28; i++) {
    days.push(i + 1);
  }

  //select 된 값에 따라 표시되는 값이 달라짐
  const [dateRange, setDateRange] = useState(days.slice(0, 7));

  useEffect(() => {
    axios
      .get("/api/farms/temperature", { params: { each: dateRange } })
      .then((res) => {
        console.log(res.data);
        setTemperatureData(res.data);
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
        text: "축사 온도 데이터",
      },
    },
  };

  const labels = temperatureData.map((e) => {
    return dayjs(e.createDate).format("YY-MM-DD");
  });

  const data = {
    labels,
    datasets: [
      {
        label: "최고온도",
        data: temperatureData.map((e) => {
          return e.maxTemp;
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },

      {
        label: "평균온도",
        data: temperatureData.map((e) => {
          return e.avgTemp;
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },

      {
        label: "최저온도",
        data: temperatureData.map((e) => {
          return e.minTemp;
        }),
        borderColor: "rgba(235, 53, 226, 1)",
        backgroundColor: "rgba(114, 14, 109, 0.5)",
      },
    ],
  };

  return (
    <SafeAreaView>
      <View>
        <Text>온도</Text>
      </View>
      <View>
        <Text>습도</Text>
      </View>
      <View>
        <Text>조도</Text>
      </View>
      <View>
        <Text>공기질</Text>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})