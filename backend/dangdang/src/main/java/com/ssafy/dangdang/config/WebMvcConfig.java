//package com.ssafy.dangdang.config;
//
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebMvcConfig implements WebMvcConfigurer {
//    static String[] resourceLocations = {"classpath:/templates/", "classpath:/static/"};
//
//
//    @Value("${file.upload.baseLocation}")
//    private String baseLocation;
//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//
//        // 이미지 업로드 경로
//        registry.addResourceHandler("/files/**")
//                .addResourceLocations("file:///" + baseLocation);
////        registry.addResourceHandler("/**")
////                .addResourceLocations(resourceLocations);
//    }
//
//}
