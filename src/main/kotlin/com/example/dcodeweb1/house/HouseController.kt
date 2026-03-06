package com.example.dcodeweb1.house

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.baomidou.mybatisplus.core.metadata.IPage
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.example.dcodeweb1.common.BaseContext
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import javax.validation.Valid

@RestController
@RequestMapping("/house")
class HouseController {

    @Autowired
    private lateinit var houseService: HouseService // 使用 lateinit 以确保非空

    private val logger = KotlinLogging.logger {  }

    /**
     * 房源信息分页查询
     */
    @GetMapping("/page")
    fun pageHouses(
        @RequestParam("current") current: Int,
        @RequestParam("size") size: Int,
        @RequestParam(required = false) location: String? // 如果提供了这些参数，查询将只返回匹配的记录
    ): ResponseEntity<IPage<House>> {
        val page = Page<House>(current.toLong(), size.toLong())
        val queryWrapper = QueryWrapper<House>()
        location?.let { queryWrapper.like("location", it) }
        val housePage = houseService.page(page, queryWrapper)
        return ResponseEntity.ok(housePage)
    }

    /**
     * 新增房源
     */
    @PostMapping("/add")
    fun addHouse(@RequestBody @Valid house: House): ResponseEntity<Any> {
        logger.info { "Received house data in add: $house" }

        try {
            house.setCreateUser(BaseContext.getCurrentId())
            house.setCreateTime(LocalDateTime.now())
            house.setUpdateUser(BaseContext.getCurrentId())
            house.setUpdateTime(LocalDateTime.now())

            // 保存房源信息到数据库
            houseService.save(house)
            return ResponseEntity.ok().body("House added successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding house")
        }
    }

    /**
     * 更新房源数据
     */
    @PostMapping("/update")
    fun updateHouse(@RequestBody @Valid house: House): ResponseEntity<Any> {
        logger.info { "Received house data in update: $house" }

        try {
            house.setUpdateUser(BaseContext.getCurrentId())
            house.setUpdateTime(LocalDateTime.now())

            // 更新房源信息到数据库
            houseService.updateById(house)
            return ResponseEntity.ok().body("House updated successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating house")
        }
    }

    /**
     * 删除
     */
    @DeleteMapping("/delete/{houseId}")
    fun deleteHouse(@PathVariable houseId: Long): ResponseEntity<Any> {
        try {
            // 调用服务层的方法删除房源
            houseService.removeById(houseId)
            return ResponseEntity.ok().body("House deleted successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting house")
        }
    }

    /**
     * 卖房信息提交
     */
    @PostMapping("/add_for_sell")
    fun addForSell(@RequestBody @Valid house: House): ResponseEntity<Any> {
        try {
            house.setStatus(2)
            house.setCreateUser(BaseContext.getCurrentId())
            house.setCreateTime(LocalDateTime.now())
            house.setUpdateUser(BaseContext.getCurrentId())
            house.setUpdateTime(LocalDateTime.now())

            houseService.save(house)
            return ResponseEntity.ok().body("House added successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding house")
        }
    }

    /**
     * 审核页面的分页数据
     */
    @GetMapping("/page_for_exam")
    fun pageHouses(
        @RequestParam("current") current: Int,
        @RequestParam("size") size: Int,
        @RequestParam(required = false) location: String?,
        @RequestParam(required = false) status: Int? // 添加一个参数来过滤状态
    ): ResponseEntity<IPage<House>> {
        val page = Page<House>(current.toLong(), size.toLong())
        val queryWrapper = QueryWrapper<House>()
        location?.let { queryWrapper.like("location", it) }
        status?.let { queryWrapper.eq("status", it) } // 根据状态过滤
        val housePage = houseService.page(page, queryWrapper)
        return ResponseEntity.ok(housePage)
    }

    /**
     * 来自用户首页的查询
     */
    @GetMapping("/page_sell")
    fun pageHousesSell(
        @RequestParam("current") current: Int,
        @RequestParam("size") size: Int,
        @RequestParam(required = false) location: String?
    ): ResponseEntity<IPage<House>> {
        val page = Page<House>(current.toLong(), size.toLong())
        val queryWrapper = QueryWrapper<House>()
        queryWrapper.eq("status", 0) // 只查询状态为0的房源
        location?.let { queryWrapper.like("location", it) } // 如果提供了location参数，也作为查询条件
        val housePage = houseService.page(page, queryWrapper)
        return ResponseEntity.ok(housePage)
    }

    /**
     * 设置热门房源
     */
    @PostMapping("/hot/{houseId}")
    fun setHotHouse(@PathVariable houseId: Long): ResponseEntity<Any> {
        try {
            // 查找对应的 House 实体
            val house = houseService.getById(houseId) ?: return ResponseEntity.notFound().build()

            // 更新 hotPoint 属性
            if (house.hotPoint == 0) {
                house.hotPoint = 1
            } else {
                house.hotPoint = 0
            }

            // 保存更新后的实体
            houseService.updateById(house)

            return ResponseEntity.ok().body("House set successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error setting hot house")
        }
    }

    /**
     * 获取热门房源
     */
    @GetMapping("/hot")
    fun getHotHouses(): ResponseEntity<List<String>> {
        val hotHouses = houseService.list(QueryWrapper<House>().apply {
            eq("hot_point", 1) // 查询 hotPoint 属性值为 1 的房源
        })
        return ResponseEntity.ok(hotHouses.map { it.getLocation() }) // 仅返回 location 属性
    }

    /**
     * 查询用户出售的房源
     */
    @GetMapping("/page_my_sell")
    fun getMySaleHouse(
        @RequestParam("current") current: Int,
        @RequestParam("size") size: Int,
        @RequestParam(required = false) location: String?,
    ): ResponseEntity<Any> {
        val userId = BaseContext.getCurrentId()

        val page = Page<House>(current.toLong(), size.toLong())
        val queryWrapper = QueryWrapper<House>()
        queryWrapper.eq("create_user", userId) // 只查询当前用户的房源
        location?.let { queryWrapper.like("location", it) } // 如果提供了location参数，也作为查询条件
        val housePage = houseService.page(page, queryWrapper)
        return ResponseEntity.ok(housePage)
    }

    /**
     * 卖房
     */
    @PostMapping("/update-status/{houseId}")
    fun sellHouse(@PathVariable houseId: Long): ResponseEntity<Any> {
        try {
            // 查找对应的 House 实体
            val house = houseService.getById(houseId) ?: return ResponseEntity.notFound().build()

            // 更新属性
            house.setStatus(1)

            // 保存更新后的实体
            houseService.updateById(house)

            return ResponseEntity.ok().body("House set successfully")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error setting hot house")
        }
    }
}
