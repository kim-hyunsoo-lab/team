package com.craft.backend_farm_hub.qna.service;

import com.craft.backend_farm_hub.qna.mapper.QnaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QnaService {
  private final QnaMapper qnaMapper;


}
