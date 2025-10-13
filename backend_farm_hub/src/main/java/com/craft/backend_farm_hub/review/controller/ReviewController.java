package com.craft.backend_farm_hub.review.controller;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import com.craft.backend_farm_hub.review.dto.ReviewImgDTO;
import com.craft.backend_farm_hub.review.service.ReviewService;
import com.craft.backend_farm_hub.util.ReviewImgUploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  public ResponseEntity<?> regReview(
          @RequestParam(name = "reviewImgs", required = false) MultipartFile[] reviewImgs,
          ReviewDTO reviewDTO) {
    try {
      List<ReviewImgDTO> reviewImgList = ReviewImgUploadUtil.multipleReviewFileUpload(reviewImgs);
      reviewService.regReview(reviewDTO, reviewImgList);

      return ResponseEntity
              .status(HttpStatus.CREATED)
              .body("리뷰가 등록되었습니다.");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("리뷰 등록 중 오류가 발생했습니다.");
    }
  }

  // 이미지 없는 리뷰 등록
  @PostMapping("/noimg")
  public ResponseEntity<?> regReviewNoImg(@RequestBody ReviewDTO reviewDTO){
    try {
      reviewService.regReviewNoImg(reviewDTO);

      return ResponseEntity
              .status(HttpStatus.CREATED)
              .body("리뷰가 등록되었습니다.");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("리뷰 등록 중 오류가 발생했습니다.");
    }
  }

  // 상품별 리뷰 목록 조회
  @GetMapping("/getList/{itemNum}")
  public ResponseEntity<?> getReviewListforItem(@PathVariable("itemNum") int itemNum){
    try{
      List<ReviewDTO> list = reviewService.getReviewListforItem(itemNum);
      return ResponseEntity.ok(list);  // 빈 리스트도 OK로 반환
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("조회 중 오류가 발생했습니다.");
    }
  }


}
