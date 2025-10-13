package com.craft.backend_farm_hub.farm.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IlluminanceDTO {
  private int imId;
  private int illuminance;
  private LocalDateTime createDate;

  private Double avgIll;
  private Double maxIll;
  private Double minIll;
}
