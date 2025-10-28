import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import PageTitle from '@/components/common/PageTitle';
import { SERVER_URL } from '@/constants/appConst';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colorConstant';

const QnaMyPage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null); 
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
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

  // 문의 목록 조회
  useEffect(() => {
    if (!userInfo?.memId) return;
    
    const fetchQnaList = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${SERVER_URL}/reply/user/${userInfo.memId}`);
        setQnaList(res.data);
      } catch (error) {
        console.error('에러:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQnaList();
  }, [userInfo]);

  // 현재 페이지 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQnaList = qnaList.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 총 페이지 수
  const totalPages = Math.ceil(qnaList.length / itemsPerPage);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <PageTitle title='문의 목록'/>
        
        <ScrollView style={styles.scrollView}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6c757d" />
              <Text style={styles.loadingText}>로딩 중...</Text>
            </View>
          ) : qnaList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>등록된 문의가 없습니다.</Text>
            </View>
          ) : (
            <>
              {/* 문의 목록 */}
              <View style={styles.qnaDiv}>
                {currentQnaList.map((qna, i) => (
                  <View key={i} style={styles.qnaItem}>
                    {/* 문의 번호/회원ID/날짜 */}
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemInfoLeft}>
                        {qna.qnaDTO.qnaNum} / {qna.qnaDTO.memId}
                      </Text>
                      <Text style={styles.itemInfoRight}>
                        {dayjs(qna.qnaDTO.qnaDate).format('YYYY/MM/DD HH:mm:ss')}
                      </Text>
                    </View>
                    
                    {/* 문의 내용 */}
                    <View style={styles.questionSection}>
                      <View style={styles.question}>
                        <Text style={styles.qLabel}>Q.</Text>
                        <Text style={styles.qContent}>{qna.qnaDTO.content}</Text>
                      </View>
                    </View>
                    
                    {/* 답변 섹션 */}
                    <View style={styles.answerSection}>
                      {qna.replyContent ? (
                        <>
                          <View style={styles.answerInfo}>
                            <Text style={styles.answerInfoLeft}>{qna.replyMemId}</Text>
                            <Text style={styles.answerInfoRight}>
                              {dayjs(qna.replyDate).format('YYYY/MM/DD HH:mm:ss')}
                            </Text>
                          </View>
                          <View style={styles.answer}>
                            <Text style={styles.aLabel}>A.</Text>
                            <Text style={styles.aContent}>{qna.replyContent}</Text>
                          </View>
                        </>
                      ) : (
                        <View style={styles.answerPending}>
                          <Text style={styles.aLabel}>A.</Text>
                          <Text style={styles.pendingText}>답변 준비중...</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* 페이지네이션 */}
              {qnaList.length > 0 && (
                <View style={styles.paginationContainer}>
                  {/* 이전 버튼 */}
                  <TouchableOpacity 
                    style={[styles.pageButton, currentPage === 0 && styles.disabledButton]}
                    onPress={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <Text style={[styles.pageButtonText, currentPage === 0 && styles.disabledText]}>
                      {'<<'}
                    </Text>
                  </TouchableOpacity>

                  {/* 페이지 번호 */}
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
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default QnaMyPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    color: '#666',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 20,
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  qnaDiv: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 20,
  },
  qnaItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemInfo: {
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemInfoLeft: {
    fontSize: 16,
    color: '#374151',
    fontWeight: 'bold',
  },
  itemInfoRight: {
    fontSize: 11,
    color: '#6b7280',
  },
  questionSection: {
    padding: 16,
  },
  question: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  qLabel: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 18,
    flexShrink: 0,
  },
  qContent: {
    flex: 1,
    color: '#1f2937',
    lineHeight: 22,
    fontSize: 14,
  },
  answerSection: {
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  answerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  answerInfoLeft: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  answerInfoRight: {
    fontSize: 11,
    color: '#6b7280',
  },
  answer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  aLabel: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 18,
    flexShrink: 0,
  },
  aContent: {
    flex: 1,
    color: '#1f2937',
    lineHeight: 22,
    fontSize: 14,
  },
  answerPending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  pendingText: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
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