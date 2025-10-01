package com.craft.backend_farm_hub.qna.dto;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QnaDTO {
  private int qnaNum;
  private int itemNum;
  private String memId;
  private LocalDateTime qnaDate;
  private String content;
  private ItemDTO itemDTO;
}
