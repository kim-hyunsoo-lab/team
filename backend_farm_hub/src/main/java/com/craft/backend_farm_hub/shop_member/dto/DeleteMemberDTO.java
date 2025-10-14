package com.craft.backend_farm_hub.shop_member.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeleteMemberDTO {
  private int num;
  private String memId;
  private String withDrawal;
  private String reasonUncomfortable;
  private String reasonGood;
  private String reasonImprovement;
  private LocalDateTime deleteDate;
}
