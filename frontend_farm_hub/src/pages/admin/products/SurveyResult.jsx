import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./SurveyResult.module.css";

const SurveyResult = () => {
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/members/insertSurvey")
      .then((res) => {
        setSurveyData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.dateSection}>
        <h1 className={styles.title}>회원 탈퇴 설문조사 결과</h1>
        <p className={styles.subtitle}>총 {surveyData.length}건의 응답</p>

        {loading ? (
          <div className={styles.loading}>데이터를 불러오는 중...</div>
        ) : (
          <table className={styles.surveyTable}>
            <thead>
              <tr>
                <th>번호</th>
                <th>탈퇴 사유</th>
                <th>불편했던 점</th>
                <th>좋았던 점</th>
                <th>개선 사항</th>
              </tr>
            </thead>
            <tbody>
              {surveyData.length > 0 ? (
                surveyData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.num}</td>
                    <td>{item.withDrawal}</td>
                    <td>{item.reasonUncomfortable}</td>
                    <td>{item.reasonGood}</td>
                    <td>{item.reasonImprovement}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noData}>
                    설문 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SurveyResult;
