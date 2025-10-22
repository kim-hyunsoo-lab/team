package com.craft.backend_farm_hub.shop_member.controller;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import com.craft.backend_farm_hub.shop_member.dto.DeleteMemberDTO;
import com.craft.backend_farm_hub.shop_member.dto.ForgotPwDTO;
import com.craft.backend_farm_hub.shop_member.dto.ShopMemberDTO;
import com.craft.backend_farm_hub.shop_member.service.ShopMemberService;
import jakarta.servlet.http.HttpSession;
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
  public ResponseEntity<?> regMember(@RequestBody ShopMemberDTO shopMemberDTO) {
    try {
      shopMemberService.regMember(shopMemberDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("등록 중 오류 발생");
    }
  }

  //로그인 기능 api
  @GetMapping("/login")
  public ResponseEntity<?> login(ShopMemberDTO shopMemberDTO) {
    try {
      ShopMemberDTO loginMember = shopMemberService.login(shopMemberDTO);
      System.out.println(loginMember);
      if (loginMember == null) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
      else if(loginMember.getStatus().equals("WITHDRAWN")){
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("탈퇴한 계정입니다.");
      }
      return ResponseEntity.ok(loginMember);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("로그인 처리 중 오류가 발생했습니다.");
    }
  }

  //id 사용 가능 여부 판단 api
  @GetMapping("/{memId}")
  public ResponseEntity<?> checkId(@PathVariable("memId") String memId) {
    try {
      boolean isUsable = shopMemberService.isUsableId(memId);
      return ResponseEntity.ok(isUsable);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("ID 확인 중 오류가 발생했습니다.");
    }
  }

  //비밀번호 찾기 질문 목록 조회 api
  @GetMapping("/pw-question")
  public ResponseEntity<?> getQuestion() {
    try {
      List<ForgotPwDTO> list = shopMemberService.getQuestion();
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }

  //비밀번호 찾기
  @GetMapping("/forgotPw/{memId}")
  public ResponseEntity<?> forgotPw(@PathVariable("memId") String memId) {
    try {
      ShopMemberDTO shopMemberDTO = shopMemberService.forgotPw(memId);
      if (shopMemberDTO == null) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("회원 정보를 찾을 수 없습니다.");
      }
      return ResponseEntity.ok(shopMemberDTO);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }

  //비밀번호 변경
  @PutMapping("/renewalPw")
  public ResponseEntity<?> renewalPw(@RequestBody ShopMemberDTO shopMemberDTO) {
    try {
      shopMemberService.renewalPw(shopMemberDTO);
      return ResponseEntity
              .status(HttpStatus.OK)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("비밀번호 변경 중 오류가 발생했습니다");
    }
  }

  //멤버 목록 조회
  @GetMapping("/selectmembers")
  public ResponseEntity<?> selectMembers() {
    try {
      List<ShopMemberDTO> list = shopMemberService.selectMembers();
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
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

  @PostMapping("/survey")
  public ResponseEntity<String> delSurvey(@RequestBody DeleteMemberDTO deleteMemberDTO) {
    try {
      // DTO에서 직접 memId 가져오기
      String memId = deleteMemberDTO.getMemId();

      // memId 유효성 검증
      if (memId == null || memId.trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("로그인이 필요합니다.");
      }

      // 탈퇴 처리
      shopMemberService.delSurvey(deleteMemberDTO);

      return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("탈퇴 처리 중 오류가 발생했습니다.");
    }
  }

  @GetMapping("/insertSurvey")
  public ResponseEntity<?> insertSurvey(){
    try {
      List<DeleteMemberDTO> list = shopMemberService.insertSurvey();
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e) {
      e.printStackTrace();
      return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("설문 조회에 실패했습니다: " + e.getMessage());
    }
  }
}

