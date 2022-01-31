package com.ssafy.dangdang.service;


import com.ssafy.dangdang.exception.StorageException;
import com.ssafy.dangdang.exception.StorageFileNotFoundException;
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
import java.util.InputMismatchException;

@Slf4j
@Service
public class FileSystemStorageService implements StorageService {

  private final Path rootLocation;

  @Value("${file.upload.file}")
  private String fileLocation;


  @Autowired
  public FileSystemStorageService(StorageProperties properties) {
    this.rootLocation = Paths.get(properties.getLocation());
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
  public Path load(String filename) {
      return rootLocation.resolve(Paths.get(fileLocation + filename));
  }


  @Override
  public Resource loadAsResource(String filename) {
    try {
      Path file = load(filename);
      Resource resource = new UrlResource(file.toUri());

      if (resource.exists() || resource.isReadable()) {
        return resource;
      } else {
        throw new StorageFileNotFoundException(
            "Could not read file: " + filename);

      }
    } catch (MalformedURLException e) {
      throw new StorageFileNotFoundException("Could not read file: " + filename, e);
    }
  }

  @Override
  public void delete(String fileName) throws FileNotFoundException {
    try {
      File file = new File(Paths.get(fileLocation + fileName).toString());
      file.delete();
      log.info(file.getName() + " has deleted");
    } catch (SecurityException se) {
      throw new SecurityException(se.getMessage());
    }
  }


  @PostConstruct
  public void init() {
    try {
      if (!Files.exists(rootLocation))
        Files.createDirectories(rootLocation);

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
