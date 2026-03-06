package com.example.dcodeweb1.filter

import com.example.dcodeweb1.common.BaseContext
import mu.KotlinLogging
import org.springframework.util.AntPathMatcher
import java.io.IOException
import javax.servlet.*
import javax.servlet.annotation.WebFilter
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebFilter(filterName = "LoginCheckFilter", urlPatterns = ["/*"])
class LoginCheckFilter : Filter {

    companion object {
        private val logger = KotlinLogging.logger {  }
        private val pathMatcher = AntPathMatcher()
    }

    @Throws(IOException::class, ServletException::class)
    override fun doFilter(servletRequest: ServletRequest, servletResponse: ServletResponse, filterChain: FilterChain) {
        val request = servletRequest as HttpServletRequest
        val response = servletResponse as HttpServletResponse

        logger.info("拦截到请求：{}", request.requestURI)

        val urls = arrayOf(
            "/user/login",
            "/user/register",
            "/common/**",
            "/",
            "/index_sc/**",
            "/favicon.ico",
            "/login/**"
        )

        // 不需要处理
        if (check(urls, request.requestURI)) {
            logger.info("本次请求{}不需要处理", request.requestURI)
            filterChain.doFilter(request, response)
            return
        }

        // 已登录
        if (request.session.getAttribute("user") != null) {
            logger.info("已登录，用户的id为：{}", request.session.getAttribute("user"))

            val userId = request.session.getAttribute("user") as Long
            BaseContext.setCurrentId(userId)

            filterChain.doFilter(request, response)
            return
        }

        // 未登录
        logger.info("未登录")
        response.sendRedirect(request.contextPath + "/login/login.html")
    }

    fun check(urls: Array<String>, requestURI: String): Boolean {
        for (url in urls) {
            if (pathMatcher.match(url, requestURI)) {
                return true
            }
        }
        return false
    }
}
