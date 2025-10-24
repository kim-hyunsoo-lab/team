package com.craft.backend_farm_hub.pay.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PayDTO {
  //결제 관련한 테이블
  private String paymentId; // 포트원 결제 ID (imp_uid)
  private String orderId; // 주문 ID
  private String paymentMethod; // 결제 수단 (CARD, TRANS, PHONE)
  private String paymentStatus; // 결제 상태 (READY, PAID, FAILED, CANCELLED)
  private int paidAmount; // 실제 결제 금액
  private LocalDateTime paidAt; // 결제 완료 시간
}
