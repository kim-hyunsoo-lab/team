package com.craft.backend_farm_hub.item.controller;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import com.craft.backend_farm_hub.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUpload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.craft.backend_farm_hub.util.FileUploadUtil;

import java.io.File;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/items")
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

  //신상품 목록 조회 api
  @GetMapping("")
  public ResponseEntity<List<ItemDTO>> getItemList() {
    try{
      List<ItemDTO> list = itemService.getItemList();
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }

  //상품 상세 조회 api
  @GetMapping("/{itemNum}")
  public ItemDTO getItemDetail(@PathVariable("itemNum") int itemNum) {
    return itemService.getItemDetail(itemNum);
  }




}
