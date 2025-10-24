package com.craft.backend_farm_hub.pay.dto;

import lombok.Data;
import java.util.List;

@Data
public class BuyCartRequestDTO {
  private List<Integer> cartNumList;
  private String memId;
  private String imp_uid;
  private String merchant_uid;
  private int paid_amount;
}
