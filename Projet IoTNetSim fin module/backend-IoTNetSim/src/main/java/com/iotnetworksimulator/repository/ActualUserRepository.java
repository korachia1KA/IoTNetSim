package com.iotnetworksimulator.repository;

import com.iotnetworksimulator.model.ActualUser;
import com.iotnetworksimulator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActualUserRepository extends JpaRepository<ActualUser, Long> {
  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  ActualUser findTopByOrderByIdDesc();
}
