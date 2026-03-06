package com.example.dcodeweb1.user

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.baomidou.mybatisplus.core.metadata.IPage
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.example.dcodeweb1.common.BaseContext
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import javax.servlet.http.HttpServletRequest
import javax.validation.Valid

@RestController
@RequestMapping("/user")
class UserController {

    @Autowired
    private lateinit var userService: UserService // 使用 lateinit 以确保非空

    private val logger = KotlinLogging.logger {  }

    /**
     * 注册
     */
    @PostMapping("/register")
    fun register(@RequestBody @Valid registerRequest: RegisterRequest): ResponseEntity<Any> {
        logger.info { "Registering user with: ${registerRequest.username}, ${registerRequest.email}, ${registerRequest.password}, ${registerRequest.confirmPassword}" }

        val user = User().apply {
            userName = registerRequest.username
            email = registerRequest.email
            password = registerRequest.password // 应该存储哈希值
            status = 1
            createTime = LocalDateTime.now()
            updateTime = LocalDateTime.now()
        }

        userService.save(user) // save 方法返回保存后的 User 对象

        return ResponseEntity.ok().body(mapOf("message" to "注册成功，即将刷新页面")) // 返回消息
    }

    /**
     * 登录
     */
    @PostMapping("/login")
    fun login(request: HttpServletRequest, @RequestBody @Valid loginRequest: LoginRequest): ResponseEntity<Any> {
        logger.info { "logging user with: ${loginRequest.username}, ${loginRequest.password}" }

        // 查询用户
        val queryWrapper = QueryWrapper<User>()
        queryWrapper.eq("user_name", loginRequest.username)
        val user = userService.getOne(queryWrapper)

        logger.info { "find user: ${user.userName}, ${user.password}" }

        if (user == null) {
            // 账号错误
            return ResponseEntity.status(401).body(mapOf("message" to "Invalid username"))
        } else if (user.password != loginRequest.password) {
            // 密码错误
            return ResponseEntity.status(401).body(mapOf("message" to "Invalid password"))
        } else if (user.status == 9) {
            // 账号已锁定
            return ResponseEntity.status(401).body(mapOf("message" to "Account lockout"))
        }

        val IdOfUser = user.getUserId()
        request.session.setAttribute("user", IdOfUser)
        logger.info { "The id of user is: ${IdOfUser}" }

        if (user.status == 0) {
            // 管理员页面
            return ResponseEntity.ok().body(mapOf("message" to "Login successful", "redirectUrl" to "../admin_page/navigation.html"))
        }
        return ResponseEntity.ok().body(mapOf("message" to "Login successful", "redirectUrl" to "../dynasty33_page/navigation.html"))
    }

    /**
     * 用户分页查询
     */
    @GetMapping("/page")
    fun pageUsers(
        @RequestParam("current") current: Int,
        @RequestParam("size") size: Int,
        @RequestParam(required = false) username: String? // 如果提供了这些参数，查询将只返回匹配的记录
    ): ResponseEntity<IPage<User>> {
        val page = Page<User>(current.toLong(), size.toLong())
        val queryWrapper = QueryWrapper<User>()
        username?.let { queryWrapper.like("user_name", it) }
        val userPage = userService.pageUsers(page, queryWrapper)
        return ResponseEntity.ok(userPage)
    }

    /**
     * 添加用户
     */
    @PostMapping("/add")
    fun addUser(@RequestBody @Valid addRequest: AddRequest): ResponseEntity<Any> {
        val user = User().apply {
            userName = addRequest.username
            email = addRequest.email
            idNumber = addRequest.idNumber
            password = addRequest.password
            status = addRequest.status
            createUser = BaseContext.getCurrentId()!!
            createTime = LocalDateTime.now()
            updateUser = BaseContext.getCurrentId()!!
            updateTime = LocalDateTime.now()
        }
        userService.save(user) // 保存用户
        return ResponseEntity.ok().body(mapOf("message" to "添加成功"))
    }

    /**
     * 删除用户
     */
    @Transactional
    @DeleteMapping("/delete/{userId}")
    fun deleteUser(@PathVariable userId: Long): ResponseEntity<Any> {
        userService.removeById(userId) // 根据ID删除用户
        return ResponseEntity.ok().body(mapOf("message" to "User deleted successfully"))
    }

    /**
     * 修改用户
     */
    @PostMapping("/update/{userId}")
    fun updateUser(@PathVariable userId: Long, @RequestBody @Valid editRequest: EditRequest): ResponseEntity<Any> {
        try {
            val user = User().apply {
                this.userId = userId
                userName = editRequest.username
                email = editRequest.email
                idNumber = editRequest.idNumber
                password = editRequest.password
                status = editRequest.status
                updateUser = BaseContext.getCurrentId()!!
                updateTime = LocalDateTime.now()
            }
            userService.updateById(user)
            return ResponseEntity.ok().body("User updated successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user")
        }
    }

    /**
     * 登出
     */
    @PostMapping("/logout")
    fun logout(request: HttpServletRequest): ResponseEntity<Any> {
        try {
            request.session.removeAttribute("user") // 从会话中移除用户信息
            return ResponseEntity.ok().body("User logged out successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error logging out")
        }
    }

    /**
     * 用户的个人信息数据获取
     */
    @GetMapping("/v_p_i")
    fun viewAndUpdate(): ResponseEntity<Any> {
        val userId = BaseContext.getCurrentId()

        val queryWrapper = QueryWrapper<User>()
        queryWrapper.eq("user_id", userId) // 根据用户ID查询
        // 使用 select 方法指定要查询的字段
        val user = userService.getOne(queryWrapper)

        if (user != null) {
            // 如果查询到用户，返回用户信息
            return ResponseEntity.ok(user)
        } else {
            // 如果没有查询到用户，返回错误信息
            return ResponseEntity.notFound().build()
        }
    }

    /**
     * 用户更新个人数据
     */
    @PostMapping("/user_update")
    fun userUpdate(@RequestBody @Valid user: User): ResponseEntity<Any> {
        try {
            BaseContext.getCurrentId()?.let { user.setUpdateUser(it) }
            user.setUpdateTime(LocalDateTime.now())

            // 更新用户信息到数据库
            userService.updateById(user)
            return ResponseEntity.ok().body("User updated successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user")
        }
    }
}
