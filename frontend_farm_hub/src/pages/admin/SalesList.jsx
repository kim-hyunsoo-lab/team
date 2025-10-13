import React, { useEffect, useState } from 'react'
import styles from "./SalesList.module.css"
import axios from 'axios';
import dayjs from 'dayjs';
import PageTitle from '../../common/PageTitle';
import SalesListDetail from './SalesListDetail';
import Pagination from '../../common/Pagination'; 

const SalesList = () => {
  const [salesList, setSalesList] = useState([]);
  const [salesDetailData, setSalesDetailData] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);  

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; 

  useEffect(()=>{
    setLoading(true);
    axios.get('/api/buy/sales')
    .then(res=>{
      console.log(res.data);
      setSalesList(res.data);
      setLoading(false);
    }).catch(e=>{
      setLoading(false);
      const errorCode = e.status;
      if(errorCode == 400 || errorCode == 500){
        alert(`오류코드: ${errorCode}\n오류 메세지: ${e.response.data}`)}
      else(console.log(e))});
    }, []);

    const groupByDate = (data) => {
      return data.reduce((acc, item) => {
        const date = dayjs(item.buyDate).format('YYYY-MM-DD');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc
      }, {});
    };

    const groupedSalesList = groupByDate(salesList);   
    
    console.log(groupedSalesList);

    const sortedSalesEntries = Object.entries(groupedSalesList)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)); 

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSalesData = sortedSalesEntries.slice(startIndex, endIndex);

    const handlePageChange = (selectedPage) => {
      setCurrentPage(selectedPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getSalesDetail = (buyNum) => {
      axios.get(`/api/buy/salesOne/${buyNum}`)
      .then(res=>{
        console.log(res.data);
        setSalesDetailData(res.data);
      })
      .catch(e=>{
        const errorCode = e.status;
        if(errorCode == 400 || errorCode == 500){
          alert(`오류코드: ${errorCode}\n오류 메세지: ${e.response.data}`)}
        else(console.log(e))});
    }

    const gettingSalesDetail = (buyNum) => {
      getSalesDetail(buyNum);
      setModalOpen(true);
    };

    if (loading) {
      return (
        <div className={styles.container}>
          <PageTitle title='판매 목록' />
          <div className={styles.loading}>로딩 중...</div>
        </div>
      );
    }

    if (Object.keys(groupedSalesList).length === 0) {
      return (
        <div className={styles.container}>
          <PageTitle title='판매 목록' />
          <div className={styles.empty}>판매 내역이 없습니다.</div>
        </div>
      );
    }

  return (
    <div className={styles.container}>
      <PageTitle title='판매 목록' />

      {currentSalesData.map(([date, items]) => (
        <div key={date} className={styles.dateSection}>
          <div>
            {dayjs(date).format('YYYY년 MM월 DD일')}
          </div>
          <table>
            <colgroup>
              <col width="10%" />
              <col width="30%" />
              <col width="30%" />
              <col width="10%" />
              <col width="20%" />           
            </colgroup>
            <thead>
              <tr>
                <td>No</td>
                <td>주문자 ID</td>
                <td>상품명</td>
                <td>수량</td>
                <td>총 가격</td>
              </tr>
            </thead>
            <tbody>
              {
                items.map((e, i) => {
                  return(
                    <tr onClick={()=>gettingSalesDetail(e.buyNum)} key={i}>
                      <td>{items.length-i}</td>
                      <td>{e.memId}</td>
                      <td>{e.itemDTO.itemName}</td>
                      <td>{e.buyCnt}</td>
                      <td>{e.totalPrice?.toLocaleString()}원</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table> 
          <div className={styles.summary}>                    
            <span>일일 총 매출: {items[0].dailyTotal.toLocaleString()}원</span>           
          </div>   
        </div>
      ))}

      <Pagination 
        totalItems={sortedSalesEntries.length}  
        itemsPerPage={itemsPerPage}           
        onPageChange={handlePageChange}     
        currentPage={currentPage}           
        nextLabel='>>'                   
        previousLabel='<<'                     
        color='gray'                            
      />

      <SalesListDetail 
        onClose={()=>setModalOpen(false)} 
        modalOpen={modalOpen && salesDetailData !== null}
        salesDetailData={salesDetailData}
      />

    </div>
  )
}

export default SalesList