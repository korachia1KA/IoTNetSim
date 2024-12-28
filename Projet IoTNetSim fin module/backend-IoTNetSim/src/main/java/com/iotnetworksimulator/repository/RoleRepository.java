package com.iotnetworksimulator.repository;

import java.util.Optional;

import com.iotnetworksimulator.model.ERole;
import com.iotnetworksimulator.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);

  boolean existsByName(ERole name);
}
