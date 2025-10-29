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
@RequestMapping("/dibs")
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
  public ResponseEntity<?> getDibs (@RequestParam(required = false) String memId) {
    try {
      if (memId == null || memId.isEmpty()) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("회원 ID가 필요합니다.");
      }
      List<DibsDTO> dibsList = dibsService.getDibs(memId);
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

  // 개별 찜 삭제
  @DeleteMapping("/{dibsNum}")
  public ResponseEntity<?> removeDibs (@PathVariable int dibsNum) {
    try {
      dibsService.removeDibs(dibsNum);
      return ResponseEntity
              .status(HttpStatus.OK)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("삭제하지 못 했습니다.");
    }
  }

  // 여러 개 찜 삭제
  @DeleteMapping("")
  public ResponseEntity<?> removeSelectedDibs (@RequestParam List<Integer> dibsNumList) {
    try {
      dibsService.removeSelectedDibs(dibsNumList);
      return ResponseEntity
              .status(HttpStatus.OK)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("삭제하지 못 했습니다.");
    }
  }
}
