package com.craft.backend_farm_hub.review.mapper;

import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import com.craft.backend_farm_hub.review.dto.ReviewImgDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReviewMapper {
  //리뷰 등록
  public void regReview(ReviewDTO reviewDTO);

  //  리뷰 이미지 등록
  public void insertReviewImgs(List<ReviewImgDTO> reviewImgList);

  //  reviewNum 조회
  public int getNextReviewNum();

  // 리뷰 등록시 상품 평점 변경
  public void updateRating(int itemNum);

  // 상품별 리뷰 목록 조회
  public List<ReviewDTO> getReviewListforItem(int itemNum);

  // 유저별 리뷰 목록 조회
  public List<ReviewDTO> getReviewListforUser(String memId);

}
