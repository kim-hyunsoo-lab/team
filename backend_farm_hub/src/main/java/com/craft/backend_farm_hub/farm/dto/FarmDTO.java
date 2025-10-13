package com.craft.backend_farm_hub.farm.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FarmDTO {
  private int thvId;
  private float temperature;
  private float humidity;
  private int airQuality;
  private LocalDateTime createDate;


  private Double avgTemp;
  private Double maxTemp;
  private Double minTemp;
  private Double avgHum;
  private Double maxHum;
  private Double minHum;
  private Double avgAir;
  private Double maxAir;
  private Double minAir;
}
