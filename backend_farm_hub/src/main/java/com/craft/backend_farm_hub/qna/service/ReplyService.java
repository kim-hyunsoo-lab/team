package com.craft.backend_farm_hub.qna.service;

import com.craft.backend_farm_hub.qna.mapper.ReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReplyService {
  private final ReplyMapper replyMapper;
}
