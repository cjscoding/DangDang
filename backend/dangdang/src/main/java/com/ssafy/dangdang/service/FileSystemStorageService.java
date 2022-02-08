package com.ssafy.dangdang.service;


import com.ssafy.dangdang.exception.StorageException;
import com.ssafy.dangdang.exception.StorageFileNotFoundException;
import com.ssafy.dangdang.util.TypeCheckUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Slf4j
@Service
public class FileSystemStorageService implements StorageService {

  private final Path rootLocation;

  private final TypeCheckUtil typeCheckUtil;

  @Value("${file.upload.file}")
  private String fileLocation;
  @Value("${file.upload.video}")
  private String videoLocation;
  @Value("${file.upload.image}")
  private String imageLocation;

  @Autowired
  public FileSystemStorageService(StorageProperties properties, TypeCheckUtil typeCheckUtil) {
    this.rootLocation = Paths.get(properties.getLocation());
    this.typeCheckUtil = typeCheckUtil;
  }

  @Override
  public void store(String uuid, MultipartFile file) throws IOException {
    if (file.isEmpty()) {
      throw new StorageException("Failed to store empty file.");
    }
    Path destinationFile = rootLocation.resolve(Paths.get(fileLocation + uuid + file.getOriginalFilename())).normalize().toAbsolutePath();
    try (InputStream inputStream = file.getInputStream()) {
      Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
    }
  }

  @Override
  public void imageStore(String uuid, MultipartFile file) throws IOException {
    if (file.isEmpty()) {
      throw new StorageException("Failed to store empty file.");
    }
    if (!typeCheckUtil.isImageFile(file.getOriginalFilename())) throw new IOException("이미지 파일이 아닙니다");

    Path destinationFile = rootLocation.resolve(Paths.get(imageLocation + uuid + file.getOriginalFilename())).normalize().toAbsolutePath();
    try (InputStream inputStream = file.getInputStream()) {
      Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
    }
  }

  @Override
  public Path load(String filename) {
      return rootLocation.resolve(Paths.get(fileLocation + filename));
  }


  @Override
  public Resource loadAsResource(String filename) {
    try {
      Path file = load(filename);
      Resource resource = new UrlResource(file.toUri());

      return getResource(resource, filename);
    } catch (MalformedURLException e) {
      throw new StorageFileNotFoundException("Could not read file: " + filename, e);
    }
  }

  @Override
  public Resource loadImageAsResource(String filename) {
    try {
      Path file =rootLocation.resolve(Paths.get(imageLocation + filename));
      Resource resource = new UrlResource(file.toUri());
      return getResource(resource, filename);
    } catch (MalformedURLException e) {
      throw new StorageFileNotFoundException("Could not read file: " + filename, e);
    }
  }

  @Override
  public Resource loadVideoAsResource(String filename) {
    try {
      Path file =rootLocation.resolve(Paths.get(videoLocation + filename));
      Resource resource = new UrlResource(file.toUri());
      return getResource(resource, filename);
    } catch (MalformedURLException e) {
      throw new StorageFileNotFoundException("Could not read file: " + filename, e);
    }
  }

  private Resource getResource(Resource resource, String filename) {
    if (resource.exists() || resource.isReadable()) {
      return resource;
    } else {
      throw new StorageFileNotFoundException(
              "Could not read file: " + filename);
    }
  }

  @Override
  public void delete(String fileName) throws FileNotFoundException {
    try {
      File file = new File(Paths.get(fileLocation + fileName).toString());
      if(file.delete())
      log.info(file.getName() + " has deleted");
      else log.error("존재하지 않는 파일입니다");
    } catch (SecurityException se) {
      throw new SecurityException(se.getMessage());
    }
  }

  @Override
  public void deleteImage(String fileName) throws FileNotFoundException {
    try {
      File file = new File(Paths.get(imageLocation + fileName).toString());
      if(file.delete())
        log.info(file.getName() + " has deleted");
      else log.error("존재하지 않는 파일입니다");
    } catch (SecurityException se) {
      throw new SecurityException(se.getMessage());
    }
  }

  @Override
  public void deleteVideo(String fileName) throws FileNotFoundException {
    try {
      File file = new File(Paths.get(videoLocation + fileName).toString());
      if(file.delete())
        log.info(file.getName() + " has deleted");
      else log.error("존재하지 않는 파일입니다");
    } catch (SecurityException se) {
      throw new SecurityException(se.getMessage());
    }
  }

  @PostConstruct
  public void init() {
    try {
      if (!Files.exists(rootLocation))
        Files.createDirectories(rootLocation);
      if (!Files.exists(Paths.get(imageLocation)))
        Files.createDirectories(Paths.get(imageLocation));
      if (!Files.exists(Paths.get(videoLocation)))
        Files.createDirectories(Paths.get(videoLocation));
      if (!Files.exists(Paths.get(fileLocation)))
        Files.createDirectories(Paths.get(fileLocation));

    } catch (IOException e) {
      throw new StorageException("Could not initialize storage", e);
    }
  }


  private Path getPathByType(MultipartFile file, String uuid) {
      return rootLocation.resolve(Paths.get(fileLocation + uuid + file.getOriginalFilename())).normalize().toAbsolutePath();
  }

}
