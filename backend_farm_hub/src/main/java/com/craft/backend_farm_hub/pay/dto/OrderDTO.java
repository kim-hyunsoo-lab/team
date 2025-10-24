package com.craft.backend_farm_hub.pay.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderDTO {
  //주문에 관련한 테이블
  private String orderId;
  private String memId;
  private String productName;
  private int totalAmount;
  private String orderStatus;
  private String shippingRequest;
  private LocalDateTime orderDate;
}
