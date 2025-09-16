package com.craft.backend_farm_hub.review.service;

import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import com.craft.backend_farm_hub.review.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {
  private final ReviewMapper reviewMapper;
  //리뷰 등록
  public void regReview (ReviewDTO reviewDTO) {
    reviewMapper.regReview(reviewDTO);
  }
}
