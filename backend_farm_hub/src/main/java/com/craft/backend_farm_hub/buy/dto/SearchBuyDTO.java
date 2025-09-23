package com.craft.backend_farm_hub.buy.dto;

import lombok.Data;

// 구매 목록 페이지에서 전달되는 검색 데이터를 담기 위한 클래스
@Data
public class SearchBuyDTO {
  //  int로 받으면 빈문자일 때 곤란함
  private String orderNum;

  private String memId;
  private String fromDate;
  private String toDate;
}
