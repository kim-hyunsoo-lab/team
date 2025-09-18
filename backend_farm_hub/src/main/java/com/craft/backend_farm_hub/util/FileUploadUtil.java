package com.craft.backend_farm_hub.util;

import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class FileUploadUtil {
  public static ItemImgDTO fileUpload (MultipartFile img){
    String uploadPath = "D:\\01-STUDY\\dev\\team\\backend_farm_hub\\src\\main\\resources\\static\\upload\\";
    String attachedFileName = UUID.randomUUID().toString();

    int index = img.getOriginalFilename().lastIndexOf(".");
    String extension = img.getOriginalFilename().substring(index);
    attachedFileName = attachedFileName + extension;

    File f = new File(uploadPath + attachedFileName);
    try {img.transferTo(f);}
    catch (Exception e) {System.out.println(e);}

    ItemImgDTO itemImgDTO = new ItemImgDTO();
    itemImgDTO.setOriginImgName((img.getOriginalFilename()));
    itemImgDTO.setAttachedImgName(attachedFileName);
    itemImgDTO.setIsMain("Y");
    return itemImgDTO;
  }

  public static List<ItemImgDTO> multipleFileUpload(MultipartFile[] imgs){
    List<ItemImgDTO> imgList = new ArrayList<>();
    for (MultipartFile img : imgs){
      ItemImgDTO imgDTO = fileUpload(img);
      imgDTO.setIsMain("N");
      imgList.add(imgDTO);
    }
    return imgList;
  }
}