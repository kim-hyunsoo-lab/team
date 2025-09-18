package com.craft.backend_farm_hub.shop_member.dto;

import lombok.Data;

import java.time.LocalDateTime;

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

  //React에서 받아온 전화번호 배열
  private String[] memTelArr;
}
