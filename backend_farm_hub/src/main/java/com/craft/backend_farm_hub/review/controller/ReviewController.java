package com.craft.backend_farm_hub.review.controller;

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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("reviews")
public class ReviewController {
  private final ReviewService reviewService;

  // 리뷰 등록 (이미지 포함)
  @PostMapping("")
  public ResponseEntity<Map<String, Object>> insertReview(
          @RequestParam(name = "reviewImgs", required = false) MultipartFile[] reviewImgs,
          ReviewDTO reviewDTO) {

    Map<String, Object> response = new HashMap<>();

    try {
      List<ReviewImgDTO> reviewImgList = ReviewImgUploadUtil.multipleReviewFileUpload(reviewImgs);
      reviewService.insertReview(reviewDTO, reviewImgList);

      response.put("success", true);
      response.put("message", "리뷰가 등록되었습니다.");

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      e.printStackTrace();

      response.put("success", false);
      response.put("message", "리뷰 등록 중 오류가 발생했습니다.");

      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body(response);
    }
  }

  // 리뷰 등록 (이미지 없음)
  @PostMapping("/noimg")
  public ResponseEntity<Map<String, Object>> regReviewNoImg(@RequestBody ReviewDTO reviewDTO){

    Map<String, Object> response = new HashMap<>();

    try {
      reviewService.regReviewNoImg(reviewDTO);

      response.put("success", true);
      response.put("message", "리뷰가 등록되었습니다.");

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      e.printStackTrace();

      response.put("success", false);
      response.put("message", "리뷰 등록 중 오류가 발생했습니다.");

      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body(response);
    }
  }

  // 상품별 리뷰 목록 조회
  @GetMapping("/getList/{itemNum}")
  public ResponseEntity<?> getReviewListforItem(@PathVariable("itemNum") int itemNum){
    try{
      List<ReviewDTO> list = reviewService.getReviewListforItem(itemNum);
      return ResponseEntity.ok(list);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("조회 중 오류가 발생했습니다.");
    }
  }

  // 유저별 리뷰 목록 조회
  @GetMapping("/getListforuser/{memId}")
  public ResponseEntity<?> getReviewListforUser(@PathVariable("memId") String memId){
    try{
      List<ReviewDTO> list = reviewService.getReviewListforUser(memId);
      return ResponseEntity.ok(list);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("조회 중 오류가 발생했습니다.");
    }
  }
}