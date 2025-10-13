package com.craft.backend_farm_hub.qna.mapper;

import com.craft.backend_farm_hub.qna.dto.ReplyDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReplyMapper {
  //답변 등록
  public void regReply(ReplyDTO replyDTO);

  //답변 모달 내부 내용 조회
  public ReplyDTO getModalContent(int qnaNum);

  //구매자 화면에 띄워줄 질문, 답변 내용 조회
  public List<ReplyDTO> getQnaList(int itemNum);

  // 유저별 문의 내역 조회
  public List<ReplyDTO> getQnaListforUser(String memId);

}