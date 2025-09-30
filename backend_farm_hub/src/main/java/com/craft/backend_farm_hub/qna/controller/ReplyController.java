package com.craft.backend_farm_hub.qna.controller;

import com.craft.backend_farm_hub.qna.dto.ReplyDTO;
import com.craft.backend_farm_hub.qna.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {
  private final ReplyService replyService;

  //답변 등록
  @PostMapping("")
  public void regReply(@RequestBody ReplyDTO replyDTO){
    replyService.regReply(replyDTO);
  }

}
