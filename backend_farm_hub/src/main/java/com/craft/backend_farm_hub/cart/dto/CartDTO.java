package com.craft.backend_farm_hub.cart.dto;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CartDTO {
  private int cartNum;
  private int itemNum;
  private int cartCnt;
  private String memId;
  private int totalPrice;
  private LocalDateTime cartDate;

  //  장바구니에는 물건이 한 번에 하나만 들어가 있다
  private ItemDTO itemDTO;
}
