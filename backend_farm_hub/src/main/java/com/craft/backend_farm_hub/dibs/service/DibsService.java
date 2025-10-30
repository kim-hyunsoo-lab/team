package com.craft.backend_farm_hub.dibs.service;

import com.craft.backend_farm_hub.dibs.dto.DibsDTO;
import com.craft.backend_farm_hub.dibs.mapper.DibsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional  // 클래스 레벨에 선언하여 모든 메서드에 트랜잭션 적용
public class DibsService {
  private final DibsMapper dibsMapper;

  public void addDibs (DibsDTO dibsDTO) {
    dibsMapper.addDibs(dibsDTO);
  }

  @Transactional(readOnly = true)  // 조회 전용 트랜잭션으로 성능 최적화
  public List<DibsDTO> getDibs (String memId) {
    return dibsMapper.getDibs(memId);
  }

  /**
   * 개별 찜 상품 삭제
   * @param dibsNum 삭제할 찜 번호
   */
  public void removeDibs (int dibsNum) {
    dibsMapper.removeDibs(dibsNum);
  }

  /**
   * 선택한 찜 상품 삭제
   * @param dibsNumList 삭제할 찜 번호 리스트
   * - 여러 개의 찜 상품을 한 번에 삭제할 수 있습니다.
   * - 트랜잭션을 통해 모두 삭제되거나, 오류 시 모두 롤백됩니다.
   */
  public void removeSelectedDibs (List<Integer> dibsNumList) {
    dibsMapper.removeSelectedDibs(dibsNumList);
  }

  /**
   * 찜 여부 확인
   * @param memId 회원 ID
   * @param itemNum 상품 번호
   * @return 찜 여부
   */
  @Transactional(readOnly = true)
  public boolean checkDibs (String memId, int itemNum) {
    Integer count = dibsMapper.checkDibs(memId, itemNum);
    return count != null && count > 0;
  }

  /**
   * 찜 삭제 (memId와 itemNum으로)
   * @param memId 회원 ID
   * @param itemNum 상품 번호
   */
  public void removeDibsByItem (String memId, int itemNum) {
    dibsMapper.removeDibsByItem(memId, itemNum);
  }
}
