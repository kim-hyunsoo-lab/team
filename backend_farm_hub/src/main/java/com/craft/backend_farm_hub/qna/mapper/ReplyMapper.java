package com.craft.backend_farm_hub.qna.mapper;

import com.craft.backend_farm_hub.qna.dto.ReplyDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReplyMapper {
  //답변 등록
  public void regReply(ReplyDTO replyDTO);

}
