package com.craft.backend_farm_hub.review.controller;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import com.craft.backend_farm_hub.review.dto.ReviewImgDTO;
import com.craft.backend_farm_hub.review.service.ReviewService;
import com.craft.backend_farm_hub.util.ReviewImgUploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("reviews")
public class ReviewController {
  private final ReviewService reviewService;

  // 리뷰 등록
  @PostMapping("")
  public void regReview (
          @RequestParam(name = "reviewImgs", required = false) MultipartFile[] reviewImgs,
          ReviewDTO reviewDTO) {

    List<ReviewImgDTO> reviewImgList = ReviewImgUploadUtil.multipleReviewFileUpload(reviewImgs);

    reviewService.regReview(reviewDTO, reviewImgList);
  }

  // 이미지 없는 리뷰 등록
  @PostMapping("/noimg")
  public void regReviewNoImg(@RequestBody ReviewDTO reviewDTO){
    reviewService.regReviewNoImg(reviewDTO);
  }
}
