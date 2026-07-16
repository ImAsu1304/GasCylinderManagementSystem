package com.quickcylinder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String fullName;
        @NotBlank @Email
        private String email;
        private String phone;
        @NotBlank @Size(min = 6)
        private String password;
    }

    @Data
    public static class AuthResponse {
        private UserResponse user;
        private String token;

        public AuthResponse(UserResponse user, String token) {
            this.user = user;
            this.token = token;
        }
    }

    @Data
    public static class UserResponse {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String role;

        public static UserResponse from(com.quickcylinder.entity.User user) {
            UserResponse r = new UserResponse();
            r.setId(user.getId());
            r.setEmail(user.getEmail());
            r.setFullName(user.getFullName());
            r.setPhone(user.getPhone());
            r.setRole(user.getRole().name());
            return r;
        }
    }
}
