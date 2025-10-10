{/* 
  -- 사용 방법 --

  // 목록 조회를 저장할 state 변수
  const [목록, 목록 state 변경 함수] = useState([]);

  // 활성 페이지 세팅
  const [currentPage, setCurrentPage] = useState(0);

  // 보여줄 페이지
  const itemsPerPage = 5;

  // 현재 페이지 보여줄 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const 목록을 잘라 저장할 변수 = 목록.slice(startIndex, endIndex);

  // 페이지를 변경시켜줄 함수
  const handlePageChange = selectedPage => {
    setCurrentPage(selectedPage);
  };

  // 보여줄 목록을 화면에 띄우는 방법
  목록을 잘라 저장할 변수.map((qst, i) => {
    return(
      html 내용
    )
  })

  // 컴포넌트 렌더링
  <Pagination 
    totalItems={조회된 목록.length}
    itemsPerPage={itemsPerPage}
    onPageChange={handlePageChange}
    currentPage={currentPage}
    nextLabel='>>'
    previousLabel='<<'
    color='gray'
  />
*/}

import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

const Pagination = ({ 
  totalItems,           // 전체 아이템 개수 (예: 100개)
  itemsPerPage = 10,    // 페이지당 보여줄 아이템 수 (기본값: 10개)
  onPageChange,         // 페이지 변경 시 호출될 함수 (부모 컴포넌트에서 전달)
  currentPage = 0,      // 현재 활성화된 페이지 (0부터 시작, 기본값: 0)
  previousLabel="이전", // "이전" 버튼에 표시될 텍스트 (기본값: "이전")
  nextLabel="다음",     // "다음" 버튼에 표시될 텍스트 (기본값: "다음")
  color = 'green',      // 페이지네이션 색상 테마 (기본값: 'green')
                        // 가능한 값: 'blue', 'green', 'red', 'brown', 'orange', 'gray'
  ...props              // 추가로 전달되는 모든 props (ReactPaginate 컴포넌트로 전달됨)
}) => {
  // 전체 아이템 수를 페이지당 아이템 수로 나누어 총 페이지 수 계산
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    onPageChange(selected); // 선택된 페이지 번호를 부모 컴포넌트로 전달
    // onPageChange함수는 구현할 페이지에 만들어놓은 페이지를 변경시켜줄 함수 자체
  };

  return (
    <ReactPaginate
      pageCount={pageCount}              // 총 페이지 수
      onPageChange={handlePageChange}    // 페이지 변경 핸들러 함수
      previousLabel={previousLabel}      // "이전" 버튼 라벨
      nextLabel={nextLabel}              // "다음" 버튼 라벨
      className={`${styles.pagination} ${styles[color]}`}  // CSS 클래스 적용
      forcePage={currentPage}            // 현재 활성화할 페이지 강제 설정
      {...props}                         // 추가 props 전달
    />
  );
};

export default Pagination;