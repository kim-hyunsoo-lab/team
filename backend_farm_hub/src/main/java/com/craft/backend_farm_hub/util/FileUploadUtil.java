package com.craft.backend_farm_hub.util;

import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import com.craft.backend_farm_hub.review.dto.ReviewImgDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.BiConsumer;

public class FileUploadUtil {
  private static final String BASE_PATH = "D:\\01-STUDY\\dev\\team\\backend_farm_hub\\src\\main\\resources\\static\\";
  private static final String ITEM_UPLOAD_PATH = BASE_PATH + "upload\\";
  private static final String REVIEW_UPLOAD_PATH = BASE_PATH + "reviewupload\\";

  // 아이템 이미지 업로드 (메인)
  public static ItemImgDTO fileUpload(MultipartFile img) {
    return fileUpload(img, ITEM_UPLOAD_PATH, true);
  }

  // 아이템 이미지 업로드 (isMain 지정 가능)
  public static ItemImgDTO fileUpload(MultipartFile img, boolean isMain) {
    return fileUpload(img, ITEM_UPLOAD_PATH, isMain);
  }

  // 아이템 이미지 업로드 (내부 메서드)
  private static ItemImgDTO fileUpload(MultipartFile img, String uploadPath, boolean isMain) {
    String attachedFileName = generateFileName(img);
    uploadFile(img, uploadPath, attachedFileName);

    ItemImgDTO itemImgDTO = new ItemImgDTO();
    itemImgDTO.setOriginImgName(img.getOriginalFilename());
    itemImgDTO.setAttachedImgName(attachedFileName);
    itemImgDTO.setIsMain(isMain ? "Y" : "N");
    return itemImgDTO;
  }

  // 리뷰 이미지 업로드
  public static ReviewImgDTO reviewFileUpload(MultipartFile img) {
    String attachedFileName = generateFileName(img);
    uploadFile(img, REVIEW_UPLOAD_PATH, attachedFileName);

    ReviewImgDTO reviewImgDTO = new ReviewImgDTO();
    reviewImgDTO.setReviewOriginImgName(img.getOriginalFilename());
    reviewImgDTO.setReviewAttachedImgName(attachedFileName);
    return reviewImgDTO;
  }

  // 아이템 다중 이미지 업로드
  public static List<ItemImgDTO> multipleFileUpload(MultipartFile[] imgs) {
    List<ItemImgDTO> imgList = new ArrayList<>();
    if (imgs == null || imgs.length == 0) {
      return imgList;
    }

    for (MultipartFile img : imgs) {
      ItemImgDTO imgDTO = fileUpload(img, false);
      imgList.add(imgDTO);
    }
    return imgList;
  }

  // 리뷰 다중 이미지 업로드
  public static List<ReviewImgDTO> multipleReviewFileUpload(MultipartFile[] imgs) {
    List<ReviewImgDTO> imgList = new ArrayList<>();
    if (imgs == null || imgs.length == 0) {
      return imgList;
    }

    for (MultipartFile img : imgs) {
      ReviewImgDTO imgDTO = reviewFileUpload(img);
      imgList.add(imgDTO);
    }
    return imgList;
  }

  // 공통: 파일명 생성
  private static String generateFileName(MultipartFile img) {
    String uuid = UUID.randomUUID().toString();
    String originalFileName = img.getOriginalFilename();
    int index = originalFileName.lastIndexOf(".");
    String extension = originalFileName.substring(index);
    return uuid + extension;
  }

  // 공통: 파일 업로드 실행
  private static void uploadFile(MultipartFile img, String uploadPath, String fileName) {
    File directory = new File(uploadPath);
    if (!directory.exists()) {
      directory.mkdirs(); // 디렉토리가 없으면 생성
    }

    File file = new File(uploadPath + fileName);
    try {
      img.transferTo(file);
    } catch (Exception e) {
      throw new RuntimeException("파일 업로드 중 오류가 발생했습니다: " + e.getMessage(), e);
    }
  }
}