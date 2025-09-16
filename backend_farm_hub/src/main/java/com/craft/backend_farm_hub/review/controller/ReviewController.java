package com.craft.backend_farm_hub.review.controller;

import com.craft.backend_farm_hub.review.dto.ReviewDTO;
import com.craft.backend_farm_hub.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("reviews")
public class ReviewController {
  private final ReviewService reviewService;

  @PostMapping("")
  public void regReview (@RequestBody ReviewDTO reviewDTO) {
    reviewService.regReview(reviewDTO);
  }
}
