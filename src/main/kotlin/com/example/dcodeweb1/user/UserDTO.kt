package com.example.dcodeweb1.user

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val confirmPassword: String
)

data class LoginRequest(
    val username: String,
    val password: String
)

data class AddRequest(
    val username: String,
    val email: String,
    val idNumber: String,
    val password: String,
    val status: Int
)

data class EditRequest(
    val userid: Long,
    val username: String,
    val email: String,
    val idNumber: String,
    val password: String,
    val status: Int
)
