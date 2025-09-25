package com.craft.backend_farm_hub.qna.service;

import com.craft.backend_farm_hub.qna.dto.QnaDTO;
import com.craft.backend_farm_hub.qna.mapper.QnaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QnaService {
  private final QnaMapper qnaMapper;

  //상품 문의 내용 등록
  public void regQna(QnaDTO qnaDTO){
    qnaMapper.regQna(qnaDTO);
  }

  //상품 문의 내용 조회
  public List<QnaDTO> getQnaList(int itemNum){
    return qnaMapper.getQnaList(itemNum);
  }

}
