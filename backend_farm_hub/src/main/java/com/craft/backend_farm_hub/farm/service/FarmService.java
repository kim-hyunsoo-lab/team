package com.craft.backend_farm_hub.farm.service;

import com.craft.backend_farm_hub.farm.mapper.FarmMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmService {
  private final FarmMapper farmMapper;

  //축사 온도 데이터 조회
  public List<Integer> getTemperatureData(int[] each) {
    return farmMapper.getTemperatureData(each);
  }

  //축사 습도 데이터 조회
  public List<Integer> getHumidityData(int[] each) {
    return farmMapper.getHumidityData(each);
  }

  //축사 조도 데이터 조회
  public List<Integer> getIlluminanceData(int[] each){
    return farmMapper.getIlluminanceData(each);
  }
}
