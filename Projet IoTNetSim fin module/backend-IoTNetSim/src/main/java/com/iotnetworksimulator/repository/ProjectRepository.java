package com.iotnetworksimulator.repository;

import com.iotnetworksimulator.model.Project;
import com.iotnetworksimulator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByOwnerOrderByUpdatedAtDesc(User owner);
}