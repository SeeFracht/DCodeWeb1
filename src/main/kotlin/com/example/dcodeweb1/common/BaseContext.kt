package com.example.dcodeweb1.common

// 定义一个单例对象 BaseContext，用于存储和管理当前线程的用户ID
object BaseContext {
    private val threadLocal = ThreadLocal<Long>()

    fun setCurrentId(id: Long) {
        threadLocal.set(id)
    }

    fun getCurrentId(): Long? {
        return threadLocal.get()
    }
}
