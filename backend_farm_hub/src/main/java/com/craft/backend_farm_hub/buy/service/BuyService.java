package com.craft.backend_farm_hub.buy.service;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import com.craft.backend_farm_hub.buy.mapper.BuyMapper;
import com.craft.backend_farm_hub.cart.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuyService {
  private final BuyMapper buyMapper;
  private final CartMapper cartMapper;

  //상품 구매 기능
  public void buyItem(BuyDTO buyDTO) {
    buyMapper.buyItem(buyDTO);
  }

  public List<BuyDTO> selectBuyforMember(String memId){
    return buyMapper.selectBuyforMember(memId);
  }

  public List<BuyDTO> selectSales(){
    return buyMapper.selectSales();

  //장바구니 상품 구매 기능(선택 상품 구매, 구매하면 삭제)
  public void buyCartItem(BuyDTO buyDTO) {
    buyMapper.buyCartItem(buyDTO);
    cartMapper.deleteBoughtItem(buyDTO);
  }
}