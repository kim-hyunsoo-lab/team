package com.craft.backend_farm_hub.qna.controller;

import com.craft.backend_farm_hub.qna.dto.QnaDTO;
import com.craft.backend_farm_hub.qna.dto.ReplyDTO;
import com.craft.backend_farm_hub.qna.service.QnaService;
import com.craft.backend_farm_hub.qna.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/qna")
@RequiredArgsConstructor
public class QnaController {
  private final QnaService qnaService;
  private final ReplyService replyService;

  //상품 문의 내용 등록 api
  @PostMapping("")
  public ResponseEntity<?> regQna(@RequestBody QnaDTO qnaDTO){
    try {
      qnaService.regQna(qnaDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e){
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("문의 등록 도중 오류가 발생했습니다.");
    }
  }

  //구매자 화면에 띄워줄 질문, 답변 내용 조회 api
  @GetMapping("/{itemNum}")
  public ResponseEntity<?> getQnaList(@PathVariable int itemNum){
    try {
      List<ReplyDTO> list = replyService.getQnaList(itemNum);
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(list);
    } catch (Exception e){
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("조회 도중 오류가 발생했습니다.");
    }
  }

  //관리자 페이지 상품 문의 내용 정보 조회 api
  @GetMapping("")
  public ResponseEntity<?> getQnaListInAdmin(){
    try {
      List<QnaDTO> list = qnaService.getQnaListInAdmin();
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(list);
    } catch (Exception e){
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("상품 문의 내용 정보 조회 도중 오류가 발생했습니다.");
    }
  }



}
