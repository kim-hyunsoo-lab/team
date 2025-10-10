package com.craft.backend_farm_hub.farm.service;

import com.craft.backend_farm_hub.farm.mapper.FarmMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmService {
  private final FarmMapper farmMapper;

  public List<Integer> getTemperatureData(int[] each) {
    return farmMapper.getTemperatureData(each);
  }
}
