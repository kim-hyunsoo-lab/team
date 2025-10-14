package com.craft.backend_farm_hub.review.dto;

import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewDTO {
  private int reviewNum;
  private int rating;
  private String title;
  private String memId;
  private int itemNum;
  private String content;
  private int readCnt;
  private LocalDateTime createDate;

  private String itemName;

  //  리뷰 하나에 이미지는 여러개
  private List<ReviewImgDTO> reviewImgList;
}
