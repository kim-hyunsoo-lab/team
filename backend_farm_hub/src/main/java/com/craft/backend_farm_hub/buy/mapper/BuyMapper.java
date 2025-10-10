package com.craft.backend_farm_hub.buy.mapper;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BuyMapper {
  // 상품 구매
  public void buyItem(BuyDTO buyDTO);

  public List<BuyDTO> selectBuyforMember(String memId);

  public List<BuyDTO> selectSales();
  
  //장바구니 페이지 구매
  public void buyCartItem(BuyDTO buyDTO);

}