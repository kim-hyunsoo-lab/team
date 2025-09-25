package com.craft.backend_farm_hub.buy.controller;

import com.craft.backend_farm_hub.buy.service.BuyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/buy")
public class BuyController {
  private final BuyService buyService;
}

