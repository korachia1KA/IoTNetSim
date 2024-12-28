package com.iotnetworksimulator.controller;

import com.iotnetworksimulator.service.NetworkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.iotnetworksimulator.dto.NetworkRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/network")
public class NetworkController {

    @Autowired
    private NetworkService networkService;

    @PostMapping
    public ResponseEntity<?> handleNetworkData(@RequestBody NetworkRequestDTO request) {
        // Validate the incoming data
        if (request.getNodes() == null || request.getEdges() == null || request.getProtocol() == null) {
            return ResponseEntity.badRequest().body("Invalid data structure");
        }

        try {
            // Start the simulation
            networkService.processNetworkData(request);

            // Send response indicating that the simulation has started
            return ResponseEntity.ok("Simulation started successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing the data: " + e.getMessage());
        }
    }
}

