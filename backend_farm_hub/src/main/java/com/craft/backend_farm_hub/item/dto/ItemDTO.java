package com.craft.backend_farm_hub.item.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ItemDTO {
  private int itemNum;
  private String itemName;
  private int price;
  private String itemIntro;
  private String part;
  private double reviewAvg;
  private String origin;
  private LocalDateTime regDate;

//  상품 하나에 이미지는 여러개
  private List<ItemImgDTO> imgList;
}
