package com.amitthk.reactdragndroptodo.repository;

import com.amitthk.reactdragndroptodo.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findByDate(String date);
}
