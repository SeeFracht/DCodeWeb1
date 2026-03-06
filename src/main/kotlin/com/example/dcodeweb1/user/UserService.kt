package com.example.dcodeweb1.user

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.baomidou.mybatisplus.core.metadata.IPage
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.baomidou.mybatisplus.extension.service.IService

interface UserService : IService<User> {
    fun pageUsers(page: Page<User>, queryWrapper: QueryWrapper<User>): IPage<User>
}
