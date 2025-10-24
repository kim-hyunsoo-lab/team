package com.craft.backend_farm_hub.pay.dto;

import lombok.Data;

@Data
public class BuyRequestDTO {
  private int itemNum;
  private String memId;
  private int buyCnt;
  private String imp_uid;
  private String merchant_uid;
  private int paid_amount;
}