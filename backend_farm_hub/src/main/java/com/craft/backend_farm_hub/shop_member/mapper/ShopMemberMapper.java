package com.craft.backend_farm_hub.shop_member.mapper;

import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ShopMemberMapper {
  //회원 등록
  public void regMember(ShopMemberDTO shopMemberDTO);

  //로그인 기능
  public ShopMemberDTO login(ShopMemberDTO shopMemberDTO);
}
