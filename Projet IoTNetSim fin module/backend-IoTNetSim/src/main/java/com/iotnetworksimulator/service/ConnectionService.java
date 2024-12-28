package com.iotnetworksimulator.service;

import com.iotnetworksimulator.model.Connection;
import com.iotnetworksimulator.repository.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    public Connection addConnection(Connection connection) {
        return connectionRepository.save(connection);
    }

    public List<Connection> getAllConnections() {
        return connectionRepository.findAll();
    }

    public void deleteConnection(Long id) {
        connectionRepository.deleteById(id);
    }
}

