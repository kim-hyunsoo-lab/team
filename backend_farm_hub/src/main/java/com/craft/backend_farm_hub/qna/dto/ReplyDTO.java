package com.craft.backend_farm_hub.qna.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReplyDTO {
  private int replyNum;
  private String memId;
  private int qnaNum;
  private LocalDateTime replyDate;
  private String content;
}
