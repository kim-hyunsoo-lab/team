package com.craft.backend_farm_hub.buy.service;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import com.craft.backend_farm_hub.buy.mapper.BuyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuyService {
  private final BuyMapper buyMapper;

  //상품 구매 기능
  public void buyItem(BuyDTO buyDTO) {
    buyMapper.buyItem(buyDTO);
  }

  public List<BuyDTO> selectBuyforMember(String memId){
    return buyMapper.selectBuyforMember(memId);
  }

}