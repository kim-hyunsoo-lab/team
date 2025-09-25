package com.craft.backend_farm_hub.qna.controller;

import com.craft.backend_farm_hub.qna.dto.QnaDTO;
import com.craft.backend_farm_hub.qna.service.QnaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/qna")
@RequiredArgsConstructor
public class QnaController {
  private final QnaService qnaService;

  //상품 문의 내용 등록 api
  @PostMapping("")
  public void regQna(@RequestBody QnaDTO qnaDTO){
    qnaService.regQna(qnaDTO);
  }

  //상품 문의 내용 조회 api
  @GetMapping("/{itemNum}")
  public List<QnaDTO> getQnaList(@PathVariable int itemNum){
    return qnaService.getQnaList(itemNum);
  }

}
