package com.craft.backend_farm_hub.cart.mapper;

import com.craft.backend_farm_hub.cart.dto.CartDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CartMapper {
  public void insertCart(CartDTO cartDTO);
}
