package com.example.dcodeweb1.house

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.baomidou.mybatisplus.core.metadata.IPage
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class HouseServiceImpl : ServiceImpl<HouseMapper, House>(), HouseService {
    @Autowired
    private lateinit var houseMapper: HouseMapper

    override fun page(page: Page<House>, queryWrapper: QueryWrapper<House>): IPage<House> {
        return houseMapper.selectPage(page, queryWrapper)
    }

    override fun removeById(houseId: Long) {
        baseMapper.deleteById(houseId)
    }
}
