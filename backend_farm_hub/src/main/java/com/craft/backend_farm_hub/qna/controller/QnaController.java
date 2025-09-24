package com.craft.backend_farm_hub.qna.controller;

import com.craft.backend_farm_hub.qna.service.QnaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("qnas")
@RequiredArgsConstructor
public class QnaController {
  private final QnaService qnaService;
}
