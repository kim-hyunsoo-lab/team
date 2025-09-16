package com.craft.backend_farm_hub.review.mapper;

import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReviewMapper {
  //리뷰 등록
  public void regReview (ReviewDTO reviewDTO);
}
