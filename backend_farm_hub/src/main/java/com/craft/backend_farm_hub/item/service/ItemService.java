package com.craft.backend_farm_hub.item.service;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import com.craft.backend_farm_hub.item.mapper.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {
  private final ItemMapper itemMapper;

  public void insertItem(ItemDTO itemDTO, List<ItemImgDTO> itemImgList){
    int nextItemNum = itemMapper.getNextItemNum();
    itemDTO.setItemNum(nextItemNum);

    for (ItemImgDTO dto : itemImgList){
      dto.setItemNum(nextItemNum);
    }
    itemMapper.insertItem(itemDTO);
    itemMapper.insertImgs(itemImgList);
  }

}
