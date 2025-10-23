import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios';
import { SERVER_URL } from '../../../constants/appConst';
import { router } from 'expo-router';
import PageTitle from '../../../components/common/PageTitle';

const ProductScreen = () => {
  // 상품 정보를 저장할 state 변수들
  // useState([])는 초기값을 빈 배열로 설정
  const [newProductList, setNewProductList] = useState([]); // 신상품 목록
  const [popularProductList, setPopularProductList] = useState([]); // 인기상품 목록
  const [discountProductList, setDiscountProductList] = useState([]); // 할인상품 목록

  // 컴포넌트가 처음 렌더링될 때 한 번만 실행되는 useEffect
  // 빈 배열 []을 두 번째 인자로 전달하면 컴포넌트 마운트 시 1회만 실행됨
  useEffect(() => {
    // axios를 사용해 서버에서 상품 데이터 가져오기
    axios.get(`${SERVER_URL}/items`)
    .then(res => {
      // 서버에서 받은 모든 상품 데이터를 allData 변수에 저장
      const allData = res.data;

      // 신상품 섹션: 최근 등록순으로 정렬 (regDate 기준 내림차순)
      const sortedByDate = [...allData].sort((a, b) => new Date(b.regDate) - new Date(a.regDate));
      setNewProductList(sortedByDate.slice(0, 8));

      // 인기상품 섹션: reviewAvg 기준으로 정렬 (복합 조건)
      const sortedProducts = [...allData].sort((a, b) => {
        const avgA = a.reviewAvg || 0; // 평점이 없으면 0으로 처리
        const avgB = b.reviewAvg || 0;
        const cntA = a.reviewCnt || 0; // 리뷰 개수가 없으면 0으로 처리
        const cntB = b.reviewCnt || 0;

        // 1순위: 평점 높은 순으로 정렬
        if (avgB !== avgA) {
          return avgB - avgA;
        }

        // 2순위: 평점이 같으면 리뷰 개수 많은 순으로 정렬
        if (cntB !== cntA) {
          return cntB - cntA;
        }

        // 3순위: 평점과 리뷰 개수가 같으면 가격 낮은 순으로 정렬
        return a.price - b.price;
      });
      setPopularProductList(sortedProducts.slice(0, 8));

      const sortedByPrice = [...allData].sort((a, b) => a.price - b.price);
      setDiscountProductList(sortedByPrice.slice(0, 5));

    })
    .catch(e => console.log(e)); // 에러 발생 시 콘솔에 출력
  }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때만 실행

  // 개별 상품 카드를 그리는 함수
  // product: 상품 하나의 데이터 (itemNum, itemName, price, imgList 등의 정보를 가진 객체)
  const renderProductCard = (product) => {
    // 이미지 URL 생성
    // 서버 이미지 경로가 다를 수 있으니 확인 필요
    const imageUrl = product.imgList?.[0]?.attachedImgName
      ? `${SERVER_URL}/upload/${product.imgList[0].attachedImgName}`
      : null;

    // 디버깅: 이미지 URL 콘솔 출력
    console.log('상품:', product.itemName, '| 이미지:', imageUrl);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push('/product/product-detail')}
      >
        {/* 상품 이미지 영역 */}
        <View style={styles.productImageContainer}>
          {imageUrl ? (
            <Image
              // 서버에서 받은 이미지 파일명을 사용해 이미지 표시
              source={{ uri: imageUrl }}
              style={styles.productImage}
              // // 이미지 로딩 실패 시 콘솔 출력
              // onError={() => console.log('❌ 이미지 로딩 실패:', imageUrl)}
              // // 이미지 로딩 성공 시 콘솔 출력
              // onLoad={() => console.log('✅ 이미지 로딩 성공:', imageUrl)}
            />
          ) : (
            // 이미지가 없을 경우 대체 텍스트 표시
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#999' }}>이미지 없음</Text>
            </View>
          )}
        </View>
        {/* 상품 정보 영역 (상품명, 가격, 평점) */}
        <View style={styles.productInfo}>
          {/* 상품명: 최대 2줄까지만 표시 */}
          <Text style={styles.productName} numberOfLines={2}>{product.itemName}</Text>
          {/* 가격: 천 단위 콤마 추가 (예: 65000 -> 65,000) */}
          <Text style={styles.productPrice}>{product.price?.toLocaleString()}원</Text>
          {/* 평점이 있을 때만 표시 (reviewAvg가 0보다 클 때) */}
          {product.reviewAvg > 0 && (
            <Text style={styles.rating}>
              ⭐ {product.reviewAvg.toFixed(1)} ({product.reviewCnt || 0})
            </Text>
          )}
          {/* 할인율이 있을 경우에만 할인 뱃지 표시 */}
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}%</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // 섹션(신상품, 인기상품, 할인상품)을 렌더링하는 함수
  // title: 섹션 제목 (예: "신상품", "인기상품")
  // productList: 해당 섹션에 표시할 상품 배열
  // 3번째 매개변수 : renderSection에서 받아온 경로
  const renderSection = (title, productList, type) => (
    <View style={styles.section}>
      {/* 섹션 헤더: 제목과 더보기 버튼 */}
      <View style={styles.sectionHeader}>
        {/* <Text style={styles.sectionTitle}>{title}</Text> */}
        <PageTitle title={title} />
        <TouchableOpacity onPress={() => router.push(`/product/${type}`)}>
          <Text style={styles.seeMoreText}>더보기</Text>
        </TouchableOpacity>
      </View>
      {/* FlatList: 상품 목록을 가로 스크롤로 표시 */}
      <FlatList
        // data: 반복해서 표시할 상품 데이터 배열
        data={productList}
        // renderItem: 각 상품(item)을 어떻게 그릴지 정의
        // {item}은 productList 배열의 각 요소를 의미
        renderItem={({item}) => renderProductCard(item)}
        // keyExtractor: 각 아이템의 고유 key 값 설정 (성능 최적화용)
        // item.itemNum을 문자열로 변환해서 key로 사용
        keyExtractor={item => item.itemNum.toString()}
        // horizontal: 가로 스크롤 활성화
        horizontal={true}
        // showsHorizontalScrollIndicator: 가로 스크롤바 숨김
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle: FlatList 내부 컨텐츠 영역의 스타일
        contentContainerStyle={styles.productListContainer}
      />
    </View>
  );

  // 화면에 표시될 UI를 반환하는 부분
  return (
    // SafeAreaView: 노치, 상태바 등을 피해서 안전한 영역에만 컨텐츠 표시
    <SafeAreaView style={styles.container}>
      {/* ScrollView: 전체 화면을 세로로 스크롤 가능하게 만듦 */}
      <ScrollView style={styles.scrollView}>
        {/* 헤더: 페이지 제목 "상품" */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>상품</Text>
        </View>
        {/* 세번째 매개변수 : 이동할 경로 */}
        {/* 신상품 섹션: 모든 상품 표시 */}
        {renderSection('신상품', newProductList, 'new-product')}

        {/* 인기상품 섹션: 평점 4점 이상 상품 표시 */}
        {renderSection('인기상품', popularProductList, 'popular-product')}

        {/* 할인상품 섹션: 처음 5개 상품 표시 */}
        {renderSection('할인상품', discountProductList, 'discount-product')}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProductScreen

// ============================================
// 스타일 정의
// ============================================
const styles = StyleSheet.create({
  // 전체 컨테이너 스타일
  container: {
    flex: 1, // 화면 전체를 차지
    backgroundColor: '#fff', // 흰색 배경
  },
  // 스크롤뷰 스타일
  scrollView: {
    flex: 1,
  },
  // 헤더 영역 스타일
  header: {
    padding: 20,
    borderBottomWidth: 1, // 하단 테두리
    borderBottomColor: '#f0f0f0',
  },
  // 헤더 제목 텍스트 스타일
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  // 섹션(신상품, 인기상품, 할인상품) 영역 스타일
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  // 섹션 헤더(제목 + 더보기) 스타일
  sectionHeader: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양 끝으로 정렬
    alignItems: 'center', // 세로 중앙 정렬
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  // 섹션 제목 텍스트 스타일
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  // "더보기" 텍스트 스타일
  seeMoreText: {
    fontSize: 14,
    color: '#666',
  },
  // 상품 목록 컨테이너 스타일
  productListContainer: {
    paddingHorizontal: 20,
    // gap은 FlatList에서 지원하지 않으므로 제거
    // 대신 productCard의 marginRight로 간격 조절
  },
  // 개별 상품 카드 스타일
  productCard: {
    width: 160, // 카드 너비
    backgroundColor: 'rgb(255, 240, 220)',
    borderRadius: 12, // 둥근 모서리
    marginRight: 12, // 오른쪽 여백
    // 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // 그림자 효과 (Android)
  },
  // 상품 이미지 컨테이너 스타일
  productImageContainer: {
    width: '100%',
    height: 160, // 이미지 높이
    borderTopLeftRadius: 12, // 상단 모서리만 둥글게
    borderTopRightRadius: 12,
    overflow: 'hidden', // 둥근 모서리 밖으로 이미지 넘치지 않게
    backgroundColor: '#f5f5f5', // 이미지 로딩 전 배경색
  },
  // 상품 이미지 스타일
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // 이미지를 컨테이너에 꽉 차게 표시
  },
  // 상품 정보(이름, 가격) 영역 스타일
  productInfo: {
    padding: 12,
    position: 'relative', // 할인 뱃지 절대 위치 지정을 위함
  },
  // 상품명 텍스트 스타일
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    height: 40, // 2줄 고정 높이
  },
  // 가격 텍스트 스타일
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'brown',
    marginBottom: 4,
  },
  // 평점 텍스트 스타일
  rating: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  // 할인 뱃지 스타일
  discountBadge: {
    position: 'absolute', // 절대 위치
    top: 12,
    right: 12,
    backgroundColor: '#ff6b6b', // 빨간색
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  // 할인율 텍스트 스타일
  discountText: {
    color: '#fff', // 흰색
    fontSize: 12,
    fontWeight: 'bold',
  },
})