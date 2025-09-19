package com.craft.backend_farm_hub.util;

import com.craft.backend_farm_hub.review.dto.ReviewImgDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ReviewImgUploadUtil {
  public static ReviewImgDTO reviewFileUpload (MultipartFile img){
    String uploadPath = "D:\\01-STUDY\\dev\\team\\backend_farm_hub\\src\\main\\resources\\static\\reviewupload\\";
    String attachedFileName = UUID.randomUUID().toString();

    int index = img.getOriginalFilename().lastIndexOf(".");
    String extention = img.getOriginalFilename().substring(index);
    attachedFileName = attachedFileName + extention;

    File f = new File(uploadPath + attachedFileName);
    try {img.transferTo(f);}
    catch (Exception e) {System.out.println(e);}

    ReviewImgDTO reviewImgDTO = new ReviewImgDTO();
    reviewImgDTO.setReviewOriginImgName((img.getOriginalFilename()));
    reviewImgDTO.setReviewAttachedImgName(attachedFileName);
    return reviewImgDTO;
  }

  public static List<ReviewImgDTO> multipleReviewFileUpload(MultipartFile[] imgs){
    List<ReviewImgDTO> imgList = new ArrayList<>();
    for (MultipartFile img: imgs){
      ReviewImgDTO imgDTO = reviewFileUpload(img);
      imgList.add(imgDTO);
    }
    return imgList;
  }



}
