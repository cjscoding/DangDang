package com.ssafy.dangdang.service;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Getter
@Configuration
@PropertySource("classpath:application.yml")
public class StorageProperties {

  /**
   * s Folder location for storing files
   */
  @Value("${file.upload.baseLocation}")
  private String location;

}