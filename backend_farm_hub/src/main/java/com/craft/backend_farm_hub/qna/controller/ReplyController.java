package com.craft.backend_farm_hub.qna.controller;

import com.craft.backend_farm_hub.qna.dto.ReplyDTO;
import com.craft.backend_farm_hub.qna.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

  //답변 모달 내부 내용 조회
  @GetMapping("/{qnaNum}")
  public ReplyDTO getModalContent(@PathVariable int qnaNum){
    return replyService.getModalContent(qnaNum);
  }

}
