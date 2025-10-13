package com.craft.backend_farm_hub.farm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FarmMapper {

  public List<Integer> getTemperatureData(@Param("dateRange") int[] each);   // #[0,1,2....6]

}
