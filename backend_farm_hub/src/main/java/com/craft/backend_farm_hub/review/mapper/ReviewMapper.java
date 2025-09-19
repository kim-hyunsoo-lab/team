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

}
