package com.victorguereca.homemaintenance.specification;

import com.victorguereca.homemaintenance.model.MaintenanceTask;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import org.springframework.data.jpa.domain.Specification;

//Builds flexible database search rules

public class MaintenanceTaskSpecification {

    private MaintenanceTaskSpecification() {
    }

    public static Specification<MaintenanceTask> keywordContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String searchPattern = "%" + keyword.toLowerCase() + "%";

            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("taskName")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("notes")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("category")), searchPattern)
            );
        };
    }

    public static Specification<MaintenanceTask> categoryEquals(String category) {
        return (root, query, criteriaBuilder) -> {
            if (category == null || category.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("category")),
                    category.toLowerCase()
            );
        };
    }

    public static Specification<MaintenanceTask> statusEquals(TaskStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    public static Specification<MaintenanceTask> urgencyEquals(UrgencyLevel urgencyLevel) {
        return (root, query, criteriaBuilder) -> {
            if (urgencyLevel == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(root.get("urgencyLevel"), urgencyLevel);
        };
    }
}