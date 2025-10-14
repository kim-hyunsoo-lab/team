package com.craft.backend_farm_hub.shop_member.dto;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ShopMemberDTO {
  private String memId;
  private String memPw;
  private String memName;
  private String memTel;
  private String memEmail;
  private String memAddr;
  private String addrDetail;
  private int pwKey;
  private String pwAnswer;
  private String memRole;
  private LocalDateTime joinDate;
  private String status;

  //React에서 받아온 전화번호 배열
  private String[] memTelArr;

  //구매 내역 요약
  private String purchase;

}