package com.example.dcodeweb1.houseimage

import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.FileSystemResource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*
import javax.servlet.http.HttpServletResponse

@RestController
@RequestMapping("/house_image")
class HouseImageController {

    @Autowired
    private lateinit var houseImageService: HouseImageService // 使用 lateinit 以确保非空

    private val logger = KotlinLogging.logger {  }

    // 指定文件存储路径
    private val storagePath = Paths.get("D:/mayitbeused/DYNASTYProject/image_resource")

    /**
     * 存储图片
     */
    @PostMapping("/add")
    fun addHouseImage(@RequestParam("houseImage") file: MultipartFile, @RequestParam("location") location: String): ResponseEntity<Any> {
        if (file.isEmpty) {
            return ResponseEntity.badRequest().body("File is empty")
        }

        // 获取原始文件的扩展名
        val extension = getExtension(file.originalFilename)

        // 生成一个基于 UUID 的唯一文件名，并保留扩展名
        val uniqueFilename = UUID.randomUUID().toString() + "." + extension

        // 创建 HouseImage 对象
        val houseImage = HouseImage()
        houseImage.setLocation(location)
        houseImage.setImageName(uniqueFilename)

        // 确定文件的存储路径
        val filePath = storagePath.resolve(uniqueFilename)

        try {
            Files.copy(file.getInputStream(), filePath) // 保存文件到文件系统
        } catch (e: IOException) {
            return ResponseEntity.internalServerError().body("Could not save file to system")
        }

        try {
            houseImageService.save(houseImage) // 保存 HouseImage 对象到数据库
        } catch (e: IOException) {
            return ResponseEntity.internalServerError().body("Could not save file to database")
        }

        return ResponseEntity.ok().body("House image added successfully")
    }

    /**
     * 辅助函数，用于从原始文件名中提取扩展名
     */
    fun getExtension(originalFilename: String?): String {
        return if (originalFilename != null && originalFilename.contains(".")) {
            originalFilename.substringAfterLast(".")
        } else {
            "" // 如果没有扩展名，返回空字符串
        }
    }

    /**
     * 获取图片
     */
    @GetMapping("/image")
    fun serveImage(@RequestParam("location") location: String, response: HttpServletResponse) {
        // 从服务层获取图片文件名
        val imageName = houseImageService.getImageFileName(location)

        val imagePath = storagePath.resolve(imageName).toString()
        val resource = FileSystemResource(imagePath)
        if (resource.exists() && resource.isReadable) {
            response.contentType = "image/*" // 通用做法
            return resource.getInputStream().use { input ->
                response.outputStream.use { output ->
                    input.copyTo(output)
                }
            }
        }
        // 如果资源不存在或不可读，返回 404 状态码
        throw ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found for location: $location")
    }
}
