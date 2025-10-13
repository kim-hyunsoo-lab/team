package com.craft.backend_farm_hub.qna.controller;

import com.craft.backend_farm_hub.qna.dto.QnaDTO;
import com.craft.backend_farm_hub.qna.dto.ReplyDTO;
import com.craft.backend_farm_hub.qna.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {
  private final ReplyService replyService;

  //답변 등록
  @PostMapping("")
  public ResponseEntity<?> regReply(@RequestBody ReplyDTO replyDTO){
    try {
      replyService.regReply(replyDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e){
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("답변 등록 도중 오류가 발생했습니다");
    }
  }

  //답변 모달 내부 내용 조회
  @GetMapping("/{qnaNum}")
  public ResponseEntity<?> getModalContent(@PathVariable int qnaNum){
    try {
      ReplyDTO replyDTO = replyService.getModalContent(qnaNum);
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(replyDTO);
    } catch (Exception e){
      e.printStackTrace();

      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("답변 내용 조회 도중 오류가 발생했습니다.");
    }
  }

  //유저별 문의 내역 조회
  @GetMapping("/user/{memId}")
  public ResponseEntity<?> getQnaListforUser(@PathVariable("memId") String memId){
    try {
      List<ReplyDTO> list = replyService.getQnaListforUser(memId);
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(list);
    } catch (Exception e){
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("조회 도중 오류가 발생했습니다.");
    }
  }

}
