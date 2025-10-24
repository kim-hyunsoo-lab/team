package com.craft.backend_farm_hub.pay.service;

import com.craft.backend_farm_hub.cart.dto.CartDTO;
import com.craft.backend_farm_hub.cart.mapper.CartMapper;
import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.item.mapper.ItemMapper;
import com.craft.backend_farm_hub.pay.dto.BuyCartRequestDTO;
import com.craft.backend_farm_hub.pay.dto.BuyRequestDTO;
import com.craft.backend_farm_hub.pay.dto.OrderDTO;
import com.craft.backend_farm_hub.pay.dto.PayDTO;
import com.craft.backend_farm_hub.pay.mapper.PayMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PayService {

  private final PayMapper payMapper;
  private final ItemMapper itemMapper;
  private final CartMapper cartMapper;

  // 개별 상품 구매
  @Transactional
  public void buyItem(BuyRequestDTO buyRequest) {
    // 1. 상품 정보 조회
    ItemDTO item = itemMapper.selectItem(buyRequest.getItemNum());

    if (item == null) {
      throw new RuntimeException("상품을 찾을 수 없습니다.");
    }

    // 2. 결제 금액 검증
    int expectedAmount = item.getPrice() * buyRequest.getBuyCnt();
    if (expectedAmount != buyRequest.getPaid_amount()) {
      throw new RuntimeException("결제 금액이 일치하지 않습니다.");
    }

    // 3. 주문 생성
    OrderDTO order = new OrderDTO();
    order.setOrderId(buyRequest.getMerchant_uid());
    order.setMemId(buyRequest.getMemId());
    order.setProductName(item.getItemName());
    order.setTotalAmount(expectedAmount);
    order.setOrderStatus("PAID");

    payMapper.insertOrder(order);

    // 4. 결제 정보 저장
    PayDTO payment = new PayDTO();
    payment.setPaymentId(buyRequest.getImp_uid());
    payment.setOrderId(buyRequest.getMerchant_uid());
    payment.setPaymentMethod("CARD"); // 필요시 프론트에서 받아오기
    payment.setPaymentStatus("PAID");
    payment.setPaidAmount(buyRequest.getPaid_amount());

    payMapper.insertPayment(payment);
  }

  // 장바구니 상품 구매
  @Transactional
  public void buyCartItems(BuyCartRequestDTO buyCartRequest) {
    // 1. 장바구니 상품들 조회
    List<CartDTO> cartList = cartMapper.selectCartsByCartNums(buyCartRequest.getCartNumList());

    if (cartList == null || cartList.isEmpty()) {
      throw new RuntimeException("장바구니 상품을 찾을 수 없습니다.");
    }

    // 2. 총 금액 계산
    int totalAmount = cartList.stream()
            .mapToInt(CartDTO::getTotalPrice)
            .sum();

    // 3. 결제 금액 검증
    if (totalAmount != buyCartRequest.getPaid_amount()) {
      throw new RuntimeException("결제 금액이 일치하지 않습니다.");
    }

    // 4. 상품명 생성
    String productName = cartList.size() > 1
            ? cartList.get(0).getItemDTO().getItemName() + " 외 " + (cartList.size() - 1) + "건"
            : cartList.get(0).getItemDTO().getItemName();

    // 5. 주문 생성
    OrderDTO order = new OrderDTO();
    order.setOrderId(buyCartRequest.getMerchant_uid());
    order.setMemId(buyCartRequest.getMemId());
    order.setProductName(productName);
    order.setTotalAmount(totalAmount);
    order.setOrderStatus("PAID");

    payMapper.insertOrder(order);

    // 6. 결제 정보 저장
    PayDTO payment = new PayDTO();
    payment.setPaymentId(buyCartRequest.getImp_uid());
    payment.setOrderId(buyCartRequest.getMerchant_uid());
    payment.setPaymentMethod("CARD");
    payment.setPaymentStatus("PAID");
    payment.setPaidAmount(buyCartRequest.getPaid_amount());

    payMapper.insertPayment(payment);

    // 7. 장바구니에서 삭제
    for (Integer cartNum : buyCartRequest.getCartNumList()) {
      cartMapper.deleteCart(cartNum);
    }
  }
}
