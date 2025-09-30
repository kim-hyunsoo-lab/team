package com.craft.backend_farm_hub.buy.mapper;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BuyMapper {
  public void buyItem(BuyDTO buyDTO);

  public List<BuyDTO> selectBuyforMember(String memId);
}