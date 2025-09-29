package com.craft.backend_farm_hub.cart.controller;

import com.craft.backend_farm_hub.cart.dto.CartDTO;
import com.craft.backend_farm_hub.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/carts")
public class CartController {
  private final CartService cartService;

  //장바구니에 상품 담기 api
  @PostMapping("")
  public ResponseEntity<?> insertCart(@RequestBody CartDTO cartDTO) {
    log.info(cartDTO.toString());
    try {
      cartService.insertCart(cartDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("장바구니에 상품을 담는 중에 오류가 발생하였습니다.\n관리자에게 문의해 주세요.");
    }
  }

  //장바구니 목록 조회
  @GetMapping("/{memId}")
  public ResponseEntity<?> getCartList(
          @PathVariable("memId") String memId
  ) {
    try {
      List<CartDTO> cartList = cartService.getCartList(memId);
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(cartList);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("장바구니 목록을 불러오지 못했습니다.\n관리자에게 문의해 주세요.");
    }
  }
}
