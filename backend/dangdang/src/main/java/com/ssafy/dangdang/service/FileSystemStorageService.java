package com.ssafy.dangdang.service;


import com.ssafy.dangdang.exception.StorageException;
import com.ssafy.dangdang.exception.StorageFileNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.TypeMismatchException;
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

  @Value("${file.upload.file}")
  private String imageLocation;

  @Value("${file.upload.file}")
  private String recordLocation;


  @Value("${file.upload.baseLocation}")
  private String baseLocation;

  @Autowired
  public FileSystemStorageService() {
    this.rootLocation = Paths.get(baseLocation);
  }

  @Override
  public void store(String uuid, MultipartFile file) throws IOException {
    if (file.isEmpty()) {
      throw new StorageException("Failed to store empty file.");
    }
    Path destinationFile = getPathByType(file, uuid);
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
  public void delete(String filepath) throws FileNotFoundException {
    try {
      File file = new File(Paths.get(filepath).toString());
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
      if (!Files.exists(Paths.get(imageLocation)))
        Files.createDirectories(Paths.get(imageLocation));
      if (!Files.exists(Paths.get(recordLocation)))
        Files.createDirectories(Paths.get(recordLocation));
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
