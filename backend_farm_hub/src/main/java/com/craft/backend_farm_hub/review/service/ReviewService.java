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
    System.out.println("=== 리뷰 등록 시작 ===");
    System.out.println("제목: " + reviewDTO.getTitle());
    System.out.println("별점: " + reviewDTO.getRating());
    System.out.println("내용: " + reviewDTO.getContent());
    System.out.println("회원ID: " + reviewDTO.getMemId());
    System.out.println("상품번호: " + reviewDTO.getItemNum());

    // 1. 리뷰 등록
    reviewMapper.insertReview(reviewDTO);

    // 2. 생성된 reviewNum 확인
    int reviewNum = reviewDTO.getReviewNum();
    System.out.println("생성된 REVIEW_NUM: " + reviewNum);

    // 3. 이미지 확인
    if (reviewImgList == null) {
      System.out.println("⚠️ reviewImgList가 null입니다!");
    } else if (reviewImgList.isEmpty()) {
      System.out.println("⚠️ reviewImgList가 비어있습니다!");
    } else {
      System.out.println("✅ 이미지 개수: " + reviewImgList.size());

      // 각 이미지에 reviewNum 설정
      for (ReviewImgDTO img : reviewImgList) {
        img.setReviewNum(reviewNum);
        System.out.println("이미지 등록 준비 - reviewNum: " + reviewNum +
                ", 원본파일명: " + img.getReviewOriginImgName() +
                ", 저장파일명: " + img.getReviewAttachedImgName());
      }

      // 이미지 일괄 등록
      System.out.println("이미지 일괄 등록 시작...");
      reviewMapper.insertReviewImgs(reviewImgList);
      System.out.println("✅ 이미지 등록 완료!");
    }

    System.out.println("=== 리뷰 등록 완료 ===");
  }

  @Transactional
  public void regReviewNoImg(ReviewDTO reviewDTO) {
    System.out.println("=== 리뷰 등록 시작 (이미지 없음) ===");
    reviewMapper.insertReview(reviewDTO);
    System.out.println("=== 리뷰 등록 완료 ===");
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