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

  // 이미지 없는 리뷰 등록
  public void regReviewNoImg (ReviewDTO reviewDTO){
    reviewMapper.regReview(reviewDTO);
  }

  // 상품별 리뷰 목록 조회
  public List<ReviewDTO> getReviewListforItem(int itemNum){
    return reviewMapper.getReviewListforItem(itemNum);
  }


}
