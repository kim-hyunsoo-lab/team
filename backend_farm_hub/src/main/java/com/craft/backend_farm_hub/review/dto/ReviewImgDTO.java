package com.craft.backend_farm_hub.review.dto;

import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import lombok.Data;

import java.util.List;

@Data
public class ReviewImgDTO {
  private int reviewImgNum;
  private String reviewOriginImgName;
  private String reviewAttachedImgName;
  private int reviewNum;
}
