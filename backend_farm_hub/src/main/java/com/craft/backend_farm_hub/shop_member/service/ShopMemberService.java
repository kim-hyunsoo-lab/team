package com.craft.backend_farm_hub.shop_member.service;

import com.craft.backend_farm_hub.shop_member.dto.DeleteMemberDTO;
import com.craft.backend_farm_hub.shop_member.dto.ForgotPwDTO;
import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import com.craft.backend_farm_hub.shop_member.mapper.ShopMemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    // 1. ID와 비밀번호로 회원 조회
    ShopMemberDTO member = shopMemberMapper.login(shopMemberDTO);

    // 2. 회원이 없으면 null 반환
    if (member == null) {
      return null;
    }

    // 4. 정상 회원이면 반환
    return member;
  }

  //아이디 중복검사, 사용 가능하면 null 데이터가 조회됨
  public boolean isUsableId(String memId) {
    String selectedId = shopMemberMapper.checkIdDup(memId);
    return selectedId == null;
  }

  //비밀번호 찾기 질문 목록 조회
  public List<ForgotPwDTO> getQuestion() {
    return shopMemberMapper.getQuestion();
  }

  //비밀번호 찾기
  public ShopMemberDTO forgotPw(String memId){
    return shopMemberMapper.forgotPw(memId);
  }

  //비밀번호 변경
  public void renewalPw(ShopMemberDTO shopMemberDTO){
    shopMemberMapper.renewalPw(shopMemberDTO);
  }

  //멤버 목록 조회
  public List<ShopMemberDTO> selectMembers(){
    return shopMemberMapper.selectMembers();
  }

  //관리자인지 여부 조회해서, 관리자이면 관리자 페이지 접근 가능
  public boolean isAdmin(ShopMemberDTO shopMemberDTO) {
    shopMemberMapper.getMemRole(shopMemberDTO);
    return shopMemberDTO.getMemRole().equals("ADMIN");
  }

  //<!--회원정보 수정 시 1명의 회원정보를 조회-->
  public ShopMemberDTO selectId(String memId){
    return shopMemberMapper.selectId(memId);
  }

  //회원정보 변경 시 1명의 회원정보 수정
  public void updateId(ShopMemberDTO shopMemberDTO){
    shopMemberMapper.updateId(shopMemberDTO);
  }

  //회원탈퇴 + 설문조사 등록 쿼리
  @Transactional(rollbackFor = Exception.class)
  public void delSurvey(DeleteMemberDTO deleteMemberDTO){
    shopMemberMapper.survey(deleteMemberDTO);
    shopMemberMapper.deletemb(deleteMemberDTO.getMemId());
  }

  //설문조사 내용 조회
  public List<DeleteMemberDTO> insertSurvey(){
    return shopMemberMapper.insertSurvey();
  }
}