package com.craft.backend_farm_hub.review.mapper;

import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import com.craft.backend_farm_hub.review.dto.ReviewImgDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReviewMapper {

  // 리뷰 등록 (메서드 이름 확인!)
  void insertReview(ReviewDTO reviewDTO);

  // 리뷰 이미지 등록
  void insertReviewImgs(List<ReviewImgDTO> reviewImgList);

  // 다음 리뷰 번호 조회
  int getNextReviewNum();

  // 평점 업데이트
  void updateRating(int itemNum);

  // 상품별 리뷰 목록 조회
  List<ReviewDTO> getReviewListforItem(int itemNum);

  // 유저별 리뷰 목록 조회
  List<ReviewDTO> getReviewListforUser(String memId);
}