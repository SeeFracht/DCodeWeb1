package com.example.dcodeweb1.user

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.baomidou.mybatisplus.core.metadata.IPage
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import org.springframework.stereotype.Service

@Service
class UserServiceImpl : ServiceImpl<UserMapper, User>(), UserService {
    override fun pageUsers(page: Page<User>, queryWrapper: QueryWrapper<User>): IPage<User> {
        return page(page, queryWrapper)
    }
}
