package com.example.dcodeweb1.config

import com.baomidou.mybatisplus.annotation.DbType
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MybatisPlusConfig {
    @Bean
    fun mybatisPlusInterceptor(): MybatisPlusInterceptor {
        // 创建一个MybatisPlusInterceptor的实例，这是一个MyBatis-Plus提供的拦截器接口，用于拦截MyBatis的执行过程
        val interceptor = MybatisPlusInterceptor()

        // 创建一个PaginationInnerInterceptor的实例，这是一个分页拦截器，用于自动处理分页逻辑
        // DbType.MYSQL表示这个拦截器是为MySQL数据库配置的
        val paginationInnerInterceptor = PaginationInnerInterceptor(DbType.MYSQL)

        // 将PaginationInnerInterceptor添加到MybatisPlusInterceptor中，这样当MyBatis-Plus执行SQL时，分页拦截器就会被调用
        interceptor.addInnerInterceptor(paginationInnerInterceptor)

        // 返回配置好的MybatisPlusInterceptor实例，Spring容器将使用这个实例来处理MyBatis的拦截逻辑
        return interceptor
    }
}
