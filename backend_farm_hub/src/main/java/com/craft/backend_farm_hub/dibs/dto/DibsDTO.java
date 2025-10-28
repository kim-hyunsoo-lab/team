package com.craft.backend_farm_hub.dibs.dto;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DibsDTO {
  private int dibsNum;
  private String memId;
  private int itemNum;
  private LocalDateTime dibsDate;
  private ItemDTO itemDTO;
}
