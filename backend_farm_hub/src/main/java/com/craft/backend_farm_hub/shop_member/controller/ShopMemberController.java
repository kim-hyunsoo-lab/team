package com.craft.backend_farm_hub.shop_member.controller;

import com.craft.backend_farm_hub.shop_member.dto.ForgotPwDTO;
import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import com.craft.backend_farm_hub.shop_member.service.ShopMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

  //id 사용 가능 여부 판단 api
  @GetMapping("/{memId}")
  public boolean checkId(@PathVariable("memId") String memId) {
    //사용가능 : return true;
    return shopMemberService.isUsableId(memId);
  }

  //비밀번호 찾기 질문 목록 조회 api
  @GetMapping("/pw-question")
  public List<ForgotPwDTO> getQuestion() {
    return shopMemberService.getQuestion();
  }

  //비밀번호 찾기
  @GetMapping("/forgotPw/{memId}")
  public ShopMemberDTO forgotPw(@PathVariable("memId") String memId){
    return shopMemberService.forgotPw(memId);
  }

  //비밀번호 변경
  @PutMapping("/renewalPw")
  public void renewalPw(@RequestBody ShopMemberDTO shopMemberDTO) {
    shopMemberService.renewalPw(shopMemberDTO);
  }

  //회원정보 조회
  @GetMapping("/list")
  public List<ShopMemberDTO> selectMemberList(){
    return shopMemberService.selectMemberList();
  }


}