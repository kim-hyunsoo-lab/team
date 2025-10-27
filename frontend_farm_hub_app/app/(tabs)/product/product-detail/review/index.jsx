import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios';
import { SERVER_URL } from '@/constants/appConst';
import { FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { ScrollView } from 'react-native';

const Review = ({ itemDetail }) => {
  // 리로드용
  const [reload, setReload] = useState(Date.now());
  
  // 로그인 정보
  const [memId, setMemId] = useState(null);

  useEffect(() => {
    const loadLoginInfo = async () => {
      const loginInfoString = await SecureStore.getItemAsync('loginInfo');
      
      if (loginInfoString) {
        try {
          const loginData = JSON.parse(loginInfoString);
          setMemId(loginData.memId);
        } catch (error) {
          console.error('로그인 정보 파싱 에러:', error);
        }
      }
    };
    
    loadLoginInfo();
  }, []);

  // 리뷰 목록
  const [reviewList, setReviewList] = useState([])

  // 상품별 리뷰 목록 조회
  useEffect(() => {
    const fetchReviewList = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/reviews/getList/${itemDetail.itemNum}`);
        setReviewList(res.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchReviewList();
  }, [reload, itemDetail]);

  // 별점 컴포넌트
  const StarRating = ({ rating }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {Array.from({ length: 5 }, (_, index) => (
          <FontAwesome
            key={index}
            name={index < rating ? 'star' : 'star-o'}
            size={16}
            color="#ffc107"
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
      );
    };




  






  return (
    <View>
      <Text>Review</Text>
       <View>
         <StarRating rating={5} />
        </View>
    </View>
  )
}

export default Review

const styles = StyleSheet.create({})