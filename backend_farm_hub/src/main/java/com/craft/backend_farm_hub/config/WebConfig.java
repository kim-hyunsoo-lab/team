package com.craft.backend_farm_hub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // 접근 허용할 SPRING의 API URL
            .allowedOrigins(
                    "http://localhost:5173"//, //react
                    //"http://localhost:8081" //react-native
            ) //접근을 허용할 origin 서버
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*") //요청 시 허용할 헤더 정보
            .allowCredentials(false); //토큰 로그인 방식 사용 시에는 true 설정
  }
}
