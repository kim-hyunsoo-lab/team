package com.craft.backend_farm_hub.shop_member.controller;

import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import com.craft.backend_farm_hub.shop_member.service.ShopMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class ShopMemberController {
  private final ShopMemberService shopMemberService;

  //회원 등록 api
  @PostMapping("")
  public void regMember(@RequestBody ShopMemberDTO shopMemberDTO) {
    shopMemberService.regMember(shopMemberDTO);
  }

  //로그인 기능 api
  @GetMapping("/login")
  public ShopMemberDTO login(ShopMemberDTO shopMemberDTO) {
    return shopMemberService.login(shopMemberDTO);
  }
}
