package com.craft.backend_farm_hub.shop_member.controller;

import com.craft.backend_farm_hub.shop_member.dto.ForgotPwDTO;
import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import com.craft.backend_farm_hub.shop_member.service.ShopMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  public ShopMemberDTO forgotPw(@PathVariable("memId") String memId) {
    return shopMemberService.forgotPw(memId);
  }

  //비밀번호 변경
  @PutMapping("/renewalPw")
  public void renewalPw(@RequestBody ShopMemberDTO shopMemberDTO) {
    shopMemberService.renewalPw(shopMemberDTO);
  }

  //멤버 목록 조회
  @GetMapping("/selectmembers")
  public List<ShopMemberDTO> selectMembers() {
    return shopMemberService.selectMembers();
  }

  //관리자인지 여부 조회해서, 관리자이면 관리자 페이지 접근 가능

  @GetMapping("/is-admin")
  public ResponseEntity<?> isAdmin(ShopMemberDTO shopMemberDTO) {
    try {
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(shopMemberService.isAdmin(shopMemberDTO));
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }

  //<!--회원정보 수정 시 1명의 회원정보를 조회-->
  @GetMapping("/select/{memId}")
  public ShopMemberDTO selectId(@PathVariable("memId") String memId) {
    return shopMemberService.selectId(memId);
  }

  //회원정보 변경 시 1명의 회원정보 수정
  @PutMapping("/update/{memId}")
  public void updateId(@PathVariable("memId") String memId,
                       @RequestBody ShopMemberDTO shopMemberDTO) {
    shopMemberDTO.setMemId(memId);
    shopMemberService.updateId(shopMemberDTO);
  }
}

