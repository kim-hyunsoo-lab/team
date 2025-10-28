package com.craft.backend_farm_hub.dibs.controller;

import com.craft.backend_farm_hub.dibs.dto.DibsDTO;
import com.craft.backend_farm_hub.dibs.service.DibsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("dibs")
public class DibsController {
  private final DibsService dibsService;

  @PostMapping("")
  public ResponseEntity<?> addDibs (@RequestBody DibsDTO dibsDTO) {
    try {
      dibsService.addDibs(dibsDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("찜한상품으로 등록되지 않았습니다.");
    }
  }

  @GetMapping("")
  public ResponseEntity<?> getDibs () {
    try {
      List<DibsDTO> dibsList = dibsService.getDibs();
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(dibsList);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("찜 한 상품을 불러오지 못 했습니다.");
    }
  }
}
