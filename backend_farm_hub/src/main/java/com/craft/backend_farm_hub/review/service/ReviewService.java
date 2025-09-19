package com.craft.backend_farm_hub.review.service;

import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import com.craft.backend_farm_hub.review.dto.ReviewImgDTO;
import com.craft.backend_farm_hub.review.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ReviewService {
  private final ReviewMapper reviewMapper;
  //리뷰 등록
  public void regReview (ReviewDTO reviewDTO, List<ReviewImgDTO> reviewImgList) {
    int nextReviewNum = reviewMapper.getNextReviewNum();
    reviewDTO.setReviewNum(nextReviewNum);

    for (ReviewImgDTO dto : reviewImgList){
      dto.setReviewNum(nextReviewNum);
    }
    reviewMapper.regReview(reviewDTO);
    reviewMapper.insertReviewImgs(reviewImgList);
  }
}
