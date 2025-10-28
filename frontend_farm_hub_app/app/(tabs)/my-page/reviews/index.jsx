import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import { FontAwesome } from '@expo/vector-icons';
import PageTitle from '@/components/common/PageTitle';
import { SERVER_URL } from '@/constants/appConst';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colorConstant';

const ReviewMyPage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [reviewList, setReviewList] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [reload, setReload] = useState(Date.now());
  
  // 페이지당 아이템 수
  const itemsPerPage = 5;
  
  // 로그인 정보 가져오기
  useEffect(() => {
    const getLoginInfo = async () => {
      try {
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        if (loginInfo) {
          const loginData = JSON.parse(loginInfo);
          setUserInfo(loginData);
        } else {
          Alert.alert('알림', '로그인이 필요합니다.', [
            {
              text: '확인',
              onPress: () => router.push('/auth/login'),
            },
          ]);
        }
      } catch (error) {
        console.error('로그인 정보 파싱 에러:', error);
      }
    };
    getLoginInfo();
  }, []);

  // 리뷰 목록 조회
  useEffect(() => {
    if (!userInfo?.memId) return;
    
    const fetchReviewList = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/reviews/getListforuser/${userInfo.memId}`);
        console.log(res.data);
        setReviewList(res.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchReviewList();
  }, [userInfo]);

  // 별점 컴포넌트
  const StarRating = ({ rating }) => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, index) => (
          <FontAwesome
            key={index}
            name={index < rating ? 'star' : 'star-o'}
            size={12} 
            color="#ffc107"
            style={{ marginRight: 1 }}
          />
        ))}
      </View>
    );
  };

  // 리뷰 행 클릭 핸들러
  const handleRowClick = (reviewNum) => {
    setExpandedRowId(prevId => (prevId === reviewNum ? null : reviewNum));
  };

  // 현재 페이지 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviewList = reviewList.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 총 페이지 수
  const totalPages = Math.ceil(reviewList.length / itemsPerPage);

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView style={styles.container}>
        <PageTitle title='리뷰 목록'/>
        
        <ScrollView style={styles.scrollView}>
          {/* 테이블 헤더 */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.noCell]}>No</Text>
            <Text style={[styles.headerCell, styles.titleCell]}>제목</Text>
            <Text style={[styles.headerCell, styles.ratingCell]}>평점</Text>
            <Text style={[styles.headerCell, styles.itemCell]}>리뷰 상품명</Text>
            <Text style={[styles.headerCell, styles.dateCell]}>작성일</Text>
          </View>

          {/* 리뷰 목록 */}
          {!reviewList.length ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>등록된 리뷰가 없습니다</Text>
            </View>
          ) : (
            currentReviewList.map((e, i) => (
              <View key={e.reviewNum}>
                {/* 리뷰 요약 행 */}
                <TouchableOpacity 
                  style={styles.tableRow}
                  onPress={() => handleRowClick(e.reviewNum)}
                >
                  <Text style={[styles.cell, styles.noCell]}>
                    {reviewList.length - (startIndex + i)}
                  </Text>
                  <Text style={[styles.cell, styles.titleCell]} numberOfLines={1}>
                    {e.title}
                  </Text>
                  <View style={[styles.cell, styles.ratingCell]}>
                    <StarRating rating={e.rating} />
                  </View>
                  <Text style={[styles.cell, styles.itemCell]} numberOfLines={1}>
                    {e.itemName}
                  </Text>
                  <Text style={[styles.cell, styles.dateCell]}>
                    {dayjs(e.createDate).format('YYYY.MM.DD')}
                  </Text>
                </TouchableOpacity>

                {/* 리뷰 상세 행 (열렸을 때만) */}
                {expandedRowId === e.reviewNum && (
                  <View style={styles.detailRow}>
                    {/* 리뷰 이미지 */}
                    {e.reviewImgList && e.reviewImgList.length > 0 && (
                      <View style={styles.imageContainer}>
                        {e.reviewImgList.map((img, idx) => (
                          <Image
                            key={idx}
                            source={{ 
                              uri: `${SERVER_URL}/reviewupload/${img.reviewAttachedImgName}?t=${reload}` 
                            }}
                            style={styles.reviewImage}
                            onError={() => {
                              console.log('이미지 로드 실패:', img.reviewAttachedImgName);
                            }}
                          />
                        ))}
                      </View>
                    )}
                    {/* 리뷰 내용 */}
                    <Text style={styles.reviewContent}>{e.content}</Text>
                  </View>
                )}
              </View>
            ))
          )}

    
          {reviewList.length > 0 && (
            <View style={styles.paginationContainer}>
        
              <TouchableOpacity 
                style={[styles.pageButton, currentPage === 0 && styles.disabledButton]}
                onPress={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <Text style={[styles.pageButtonText, currentPage === 0 && styles.disabledText]}>
                  {'<<'}
                </Text>
              </TouchableOpacity>

      
              {Array.from({ length: totalPages }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.pageButton,
                    currentPage === i && styles.activePageButton
                  ]}
                  onPress={() => handlePageChange(i)}
                >
                  <Text style={[
                    styles.pageButtonText,
                    currentPage === i && styles.activePageText
                  ]}>
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* 다음 버튼 */}
              <TouchableOpacity 
                style={[styles.pageButton, currentPage === totalPages - 1 && styles.disabledButton]}
                onPress={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <Text style={[styles.pageButtonText, currentPage === totalPages - 1 && styles.disabledText]}>
                  {'>>'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default ReviewMyPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#dee2e6',
    alignItems: 'center',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cell: {
    fontSize: 12,
    textAlign: 'center',
    color: '#212529',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  noCell: {
    width: 20,
  },
  titleCell: {
    flex: 2,
    textAlign: 'left',
    paddingHorizontal: 8,
  },
  ratingCell: {
    width: 60, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCell: {
    flex: 2,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  dateCell: {
    width: 55,
    fontSize: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailRow: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  reviewImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  pageButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activePageButton: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  disabledButton: {
    opacity: 0.3,
  },
  pageButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activePageText: {
    color: '#fff',
    fontWeight: '700',
  },
  disabledText: {
    color: '#999',
  },
});