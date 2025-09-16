package com.craft.backend_farm_hub.review.dto;

import lombok.Data;

import java.time.LocalDateTime;

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
}
