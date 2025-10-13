package com.craft.backend_farm_hub.farm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FarmMapper {

  //축사 온도 데이터 조회
  public List<Integer> getTemperatureData(@Param("dateRange") int[] each);

  //축사 습도 데이터 조회
  public List<Integer> getHumidityData(@Param("dateRange") int[] each);

  //축사 조도 데이터 조회
  public List<Integer> getIlluminanceData(@Param("dateRange") int[] each);

}
