package com.craft.backend_farm_hub.review.service;

import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import com.craft.backend_farm_hub.review.dto.ReviewImgDTO;
import com.craft.backend_farm_hub.review.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
  private final ReviewMapper reviewMapper;

  @Transactional
  public void insertReview(ReviewDTO reviewDTO, List<ReviewImgDTO> reviewImgList) {
    reviewMapper.insertReview(reviewDTO);

    int reviewNum = reviewDTO.getReviewNum();

    if (reviewImgList != null && !reviewImgList.isEmpty()) {
      for (ReviewImgDTO img : reviewImgList) {
        img.setReviewNum(reviewNum);
      }
      reviewMapper.insertReviewImgs(reviewImgList);
    }

    reviewMapper.updateRating(reviewDTO.getItemNum());
  }

  @Transactional
  public void regReviewNoImg(ReviewDTO reviewDTO) {
    reviewMapper.insertReview(reviewDTO);
    reviewMapper.updateRating(reviewDTO.getItemNum());
  }

  // 상품별 리뷰 목록 조회
  public List<ReviewDTO> getReviewListforItem(int itemNum) {
    return reviewMapper.getReviewListforItem(itemNum);
  }

  // 유저별 리뷰 목록 조회
  public List<ReviewDTO> getReviewListforUser(String memId) {
    return reviewMapper.getReviewListforUser(memId);
  }
}