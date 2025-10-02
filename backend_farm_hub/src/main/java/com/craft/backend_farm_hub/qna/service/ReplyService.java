package com.craft.backend_farm_hub.qna.service;

import com.craft.backend_farm_hub.qna.dto.ReplyDTO;
import com.craft.backend_farm_hub.qna.mapper.ReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReplyService {
  private final ReplyMapper replyMapper;

  //답변 등록
  public void regReply(ReplyDTO replyDTO){
    replyMapper.regReply(replyDTO);
  }

}
