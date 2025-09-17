package com.craft.backend_farm_hub.item.dto;

import lombok.Data;

@Data
public class ItemImgDTO {
  private int imgNum;
  private String originImgName;
  private String attachedImgName;
  private int itemNum;
  private String isMain;
}
