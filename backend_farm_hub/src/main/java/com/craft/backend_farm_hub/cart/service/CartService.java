package com.craft.backend_farm_hub.cart.service;

import com.craft.backend_farm_hub.cart.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {
  private final CartMapper cartMapper;
}
