package com.craft.backend_farm_hub.shop_member.service;

import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import com.craft.backend_farm_hub.shop_member.mapper.ShopMemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShopMemberService {
  private final ShopMemberMapper shopMemberMapper;

  //회원 등록 기능(회원가입)
  public void regMember(ShopMemberDTO shopMemberDTO) {
    shopMemberMapper.regMember(shopMemberDTO);
  }

  //로그인 기능
  public ShopMemberDTO login(ShopMemberDTO shopMemberDTO) {
    return shopMemberMapper.login(shopMemberDTO);
  }
}
