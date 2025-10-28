package com.craft.backend_farm_hub.dibs.service;

import com.craft.backend_farm_hub.dibs.dto.DibsDTO;
import com.craft.backend_farm_hub.dibs.mapper.DibsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DibsService {
  private final DibsMapper dibsMapper;

  public void addDibs (DibsDTO dibsDTO) {
    dibsMapper.addDibs(dibsDTO);
  }

  public List<DibsDTO> getDibs () {
    return dibsMapper.getDibs();
  }
}
