package com.securewatch.shared.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaginationInfo {
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
}
