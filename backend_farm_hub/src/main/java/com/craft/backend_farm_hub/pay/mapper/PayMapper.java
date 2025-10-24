package com.craft.backend_farm_hub.pay.mapper;

import com.craft.backend_farm_hub.pay.dto.OrderDTO;
import com.craft.backend_farm_hub.pay.dto.PayDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PayMapper {

  // 주문 생성
  void insertOrder(OrderDTO orderDTO);

  // 결제 정보 저장
  void insertPayment(PayDTO payDTO);

  // 주문 상태 업데이트
  void updateOrderStatus(OrderDTO orderDTO);

  // 주문 조회
  OrderDTO selectOrder(String orderId);

  // 결제 정보 조회
  PayDTO selectPayment(String paymentId);
}