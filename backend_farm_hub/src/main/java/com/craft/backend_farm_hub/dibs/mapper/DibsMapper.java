package com.craft.backend_farm_hub.dibs.mapper;

import com.craft.backend_farm_hub.dibs.dto.DibsDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DibsMapper {
  public void addDibs (DibsDTO dibsDTO);

  public List<DibsDTO> getDibs ();
}
