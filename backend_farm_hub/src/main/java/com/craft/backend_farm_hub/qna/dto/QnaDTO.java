package com.craft.backend_farm_hub.qna.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QnaDTO {
  private int qnaNum;
  private String content;
  private LocalDateTime qnaDate;
  private int itemNum;
}
