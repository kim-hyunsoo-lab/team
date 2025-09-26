package com.craft.backend_farm_hub.cart.service;

import com.craft.backend_farm_hub.cart.dto.CartDTO;
import com.craft.backend_farm_hub.cart.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
  private final CartMapper cartMapper;

  //장바구니에 상품 담기
  public void insertCart(CartDTO cartDTO) {
    //장바구니에 담겨있는 상품 확인(없으면 null)
    String dup = cartMapper.findDup(cartDTO);
    if (dup == null) {
      //장바구니에 담긴 상품이 없으면 상품 새로 담기
      cartMapper.insertCart(cartDTO);
    } else {
      //장바구니에 담긴 상품이 있으면 장바구니 상품 수량만 update
      cartMapper.updateCnt(cartDTO);
    }
  }

  //장바구니 목록 조회
  public List<CartDTO> getCartList(String memId) {
    return cartMapper.getCartList(memId);
  }
}
