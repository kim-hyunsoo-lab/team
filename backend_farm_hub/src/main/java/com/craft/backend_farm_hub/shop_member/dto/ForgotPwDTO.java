package com.craft.backend_farm_hub.shop_member.dto;

import lombok.Data;

@Data
public class ForgotPwDTO {
  private int pwKey;
  private String pwQuestion;
}
