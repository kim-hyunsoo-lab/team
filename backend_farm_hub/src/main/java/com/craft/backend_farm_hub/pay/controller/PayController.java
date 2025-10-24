package com.craft.backend_farm_hub.pay.controller;

import com.craft.backend_farm_hub.pay.dto.BuyCartRequestDTO;
import com.craft.backend_farm_hub.pay.dto.BuyRequestDTO;
import com.craft.backend_farm_hub.pay.service.PayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PayController {

  private final PayService payService;

  // 개별 상품 구매
  @PostMapping("/buy")
  public ResponseEntity<?> buyItem(@RequestBody BuyRequestDTO buyRequest) {
    try {
      payService.buyItem(buyRequest);
      return ResponseEntity.ok("결제가 완료되었습니다.");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // 장바구니 상품 구매
  @PostMapping("/buy/cart")
  public ResponseEntity<?> buyCartItems(@RequestBody BuyCartRequestDTO buyCartRequest) {
    try {
      payService.buyCartItems(buyCartRequest);
      return ResponseEntity.ok("결제가 완료되었습니다.");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}