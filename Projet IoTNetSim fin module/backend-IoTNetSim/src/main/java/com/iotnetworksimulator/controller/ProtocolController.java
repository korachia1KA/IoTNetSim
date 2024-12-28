package com.iotnetworksimulator.controller;

import com.iotnetworksimulator.model.Metric;
import com.iotnetworksimulator.model.Protocol;
import com.iotnetworksimulator.service.ProtocolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/protocols")
public class ProtocolController {

    @Autowired
    private ProtocolService protocolService;

    @PostMapping
    public ResponseEntity<Protocol> addProtocol(@RequestBody Protocol protocol) {
        return ResponseEntity.ok(protocolService.addProtocol(protocol));
    }

    @GetMapping
    public ResponseEntity<List<Protocol>> getAllProtocols() {
        return ResponseEntity.ok(protocolService.getAllProtocols());
    }

    @GetMapping("/{name}")
    public ResponseEntity<Protocol> getProtocolByName(@PathVariable String name) {
        return ResponseEntity.ok(protocolService.getProtocolByName(name));
    }

    @GetMapping("/Mertic/{id}")
    public ResponseEntity<Metric> getMetric(@PathVariable Long id) {
        return ResponseEntity.ok(protocolService.getMetric(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Protocol> updateProtocol(@PathVariable Long id, @RequestBody Protocol protocolDetails) {
        return ResponseEntity.ok(protocolService.updateProtocol(id, protocolDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProtocol(@PathVariable Long id) {
        protocolService.deleteProtocol(id);
        return ResponseEntity.ok().build();
    }
}

