package com.iotnetworksimulator.controller;

import com.iotnetworksimulator.model.Connection;
import com.iotnetworksimulator.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @PostMapping
    public ResponseEntity<Connection> addConnection(@RequestBody Connection connection) {
        return ResponseEntity.ok(connectionService.addConnection(connection));
    }

    @GetMapping
    public ResponseEntity<List<Connection>> getAllConnections() {
        return ResponseEntity.ok(connectionService.getAllConnections());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteConnection(@PathVariable Long id) {
        connectionService.deleteConnection(id);
        return ResponseEntity.ok().build();
    }
}

