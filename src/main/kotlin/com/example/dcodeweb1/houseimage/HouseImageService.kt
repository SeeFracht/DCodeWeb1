package com.example.dcodeweb1.houseimage

import com.baomidou.mybatisplus.extension.service.IService

interface HouseImageService : IService<HouseImage> {
    fun findByLocation(location: String): List<HouseImage>

    fun getImageFileName(houseLocation: String): String?
}
