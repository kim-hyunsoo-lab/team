package com.craft.backend_farm_hub.buy.controller;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import com.craft.backend_farm_hub.buy.service.BuyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

  @GetMapping("/{memId}")
  public ResponseEntity<?> selectBuyforMember(@PathVariable("memId") String memId){
    try{
      List<BuyDTO> list = buyService.selectBuyforMember(memId);
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e){
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }

  @GetMapping("/sales")
  public ResponseEntity<?> selectSales(){
    try{
      List<BuyDTO> list = buyService.selectSales();
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }
}
