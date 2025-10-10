package com.craft.backend_farm_hub.farm.controller;

import com.craft.backend_farm_hub.farm.service.FarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/farms")
@RequiredArgsConstructor
public class FarmController {
  private final FarmService farmService;

  @GetMapping("/test")
  public ResponseEntity<?> getTemperatureData(int[] each) {
    try {
      System.out.println("1111" + Arrays.toString(each));
      List<Integer> list = farmService.getTemperatureData(each);
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e){
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("온도데이터가 조회되지 않았습니다.");
    }
  }

}
