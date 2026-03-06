package com.example.dcodeweb1.house

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.baomidou.mybatisplus.core.metadata.IPage
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.baomidou.mybatisplus.extension.service.IService

interface HouseService : IService<House> {
    fun page(page: Page<House>, queryWrapper: QueryWrapper<House>): IPage<House>

    fun removeById(houseId: Long)
}
