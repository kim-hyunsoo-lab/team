package com.craft.backend_farm_hub.qna.mapper;

import com.craft.backend_farm_hub.qna.dto.QnaDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface QnaMapper {

  //상품 문의 내용 등록
  public void regQna(QnaDTO qnaDTO);

  //상품 문의 내용 조회
  public List<QnaDTO> getQnaList(int itemNum);

  //관리자 페이지 상품 문의 정보 조회
  public List<QnaDTO> getQnaListInAdmin();

  //관리자 페이지 상품 문의 내용 조회
  public QnaDTO getContent(int qnaNum);

}
