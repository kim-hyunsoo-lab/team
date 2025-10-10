package com.craft.backend_farm_hub.qna.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReplyDTO {
  private int replyNum;
  private String replyMemId;
  private int qnaNum;
  private LocalDateTime replyDate;
  private String replyContent;
  private String status;
  private QnaDTO qnaDTO;
}
