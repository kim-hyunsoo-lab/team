package com.craft.backend_farm_hub.shop_member.mapper;

import com.craft.backend_farm_hub.shop_member.dto.ForgotPwDTO;
import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ShopMemberMapper {
  //회원 등록
  public void regMember(ShopMemberDTO shopMemberDTO);

  //로그인 기능
  public ShopMemberDTO login(ShopMemberDTO shopMemberDTO);

  //ID 중복검사
  public String checkIdDup(String memId);

  //비밀번호 찾기 질문 목록 조회
  public List<ForgotPwDTO> getQuestion();

  //비밀번호 찾기
  public ShopMemberDTO forgotPw(String memId);

  //비밀번호 변경
  public void renewalPw(ShopMemberDTO shopMemberDTO);

  //회원정보 조회
  public List<ShopMemberDTO> selectMemberList();

}
