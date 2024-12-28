package com.iotnetworksimulator.repository;

import com.iotnetworksimulator.model.Protocol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProtocolRepository extends JpaRepository<Protocol, Long> {
    List<Protocol> findByName(String name);

    Protocol findFirstByName(String name);
}

