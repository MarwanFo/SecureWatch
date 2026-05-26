package com.securewatch.shared.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private Instant timestamp;
    private T data;
    private String error;
    private PaginationInfo pagination;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .timestamp(Instant.now())
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> ok(T data, PaginationInfo pagination) {
        return ApiResponse.<T>builder()
                .success(true)
                .timestamp(Instant.now())
                .data(data)
                .pagination(pagination)
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .timestamp(Instant.now())
                .error(message)
                .build();
    }
}
