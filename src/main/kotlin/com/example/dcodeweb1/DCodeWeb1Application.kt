package com.example.dcodeweb1

import lombok.extern.slf4j.Slf4j
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.servlet.ServletComponentScan
import org.springframework.transaction.annotation.EnableTransactionManagement

@Slf4j
@SpringBootApplication
@ServletComponentScan
@EnableTransactionManagement
class DCodeWeb1Application

fun main(args: Array<String>) {
    runApplication<DCodeWeb1Application>(*args)
}
