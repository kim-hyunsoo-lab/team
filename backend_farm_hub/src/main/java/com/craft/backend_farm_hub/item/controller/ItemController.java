package com.craft.backend_farm_hub.item.controller;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import com.craft.backend_farm_hub.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUpload;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.craft.backend_farm_hub.util.FileUploadUtil;

import java.io.File;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("items")
public class ItemController {
  private final ItemService itemService;

  @PostMapping("")
  public void insertItem(
          @RequestParam("mainImg") MultipartFile mainImg,
          @RequestParam(name = "subImgs", required = false) MultipartFile[] subImgs,
          ItemDTO itemDTO) {

    ItemImgDTO imgDTO = FileUploadUtil.fileUpload(mainImg);
    List<ItemImgDTO> imgList = FileUploadUtil.multipleFileUpload(subImgs);
    imgList.add(imgDTO);

    itemService.insertItem(itemDTO, imgList);
  }






}
