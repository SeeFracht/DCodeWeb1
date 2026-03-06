package com.example.dcodeweb1.houseimage

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class HouseImageServiceImpl : ServiceImpl<HouseImageMapper, HouseImage>(), HouseImageService {
    @Autowired
    private lateinit var houseImageMapper: HouseImageMapper // 确保注入 HouseImageMapper

    override fun findByLocation(location: String): List<HouseImage> {
        // 使用 QueryWrapper 替代 Wrapper，并指定实体类类型为 HouseImage
        return houseImageMapper.selectList(
            QueryWrapper<HouseImage>().apply { eq("location", location) }
        )
    }

    override fun getImageFileName(houseLocation: String): String? {
        val houseImages = houseImageMapper.selectList(
            QueryWrapper<HouseImage>().apply { eq("location", houseLocation) }
        )

        return houseImages.first().getImageName()
    }
}
