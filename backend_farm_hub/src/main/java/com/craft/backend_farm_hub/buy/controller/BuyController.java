package com.craft.backend_farm_hub.buy.controller;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import com.craft.backend_farm_hub.buy.service.BuyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/buy")
public class BuyController {
  private final BuyService buyService;

  @PostMapping("")
  public ResponseEntity<?> buyItem(@RequestBody BuyDTO buyDTO) {
    try {
      buyService.buyItem(buyDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("구매 중 오류 발생!");
    }
  }
}
