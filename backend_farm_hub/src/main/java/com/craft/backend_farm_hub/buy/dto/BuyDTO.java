package com.craft.backend_farm_hub.buy.dto;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BuyDTO {
  private int buyNum;
  private int itemNum;
  private String memId;
  private LocalDateTime buyDate;
  private int buyCnt;
  private int orderNum;

  //  react에서 전달되는 cartNum 목록 데이터(cartNumList)를 받기 위해 선언한 변수
  private List<Integer> cartNumList;

  //  물건과 1대 1
  private ItemDTO itemDTO;

  //  멤버와 1대 1
  private ShopMemberDTO shopMemberDTO;

  //  구매상세내역 조회 시 데이터를 받아올 정수
  private int totalPrice;

  //  판매목록 조회시 일일 총 매출
  private int dailyTotal;
}