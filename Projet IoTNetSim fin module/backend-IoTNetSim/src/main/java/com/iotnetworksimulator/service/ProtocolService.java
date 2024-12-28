package com.iotnetworksimulator.service;

import com.iotnetworksimulator.model.Metric;
import com.iotnetworksimulator.model.Protocol;
import com.iotnetworksimulator.repository.ProtocolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProtocolService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private ProtocolRepository protocolRepository; // Assuming a repository for managing Protocol entities


    public Protocol addProtocol(Protocol protocol) {
        return protocolRepository.save(protocol);
    }

    public List<Protocol> getAllProtocols() {
        return protocolRepository.findAll();
    }

    public Metric getMetric(Long id) {
        return protocolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Protocol not found"))
                .getMetric();
    }

    public Protocol updateProtocol(Long id, Protocol protocolDetails) {
        Protocol protocol = protocolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Protocol not found"));

        protocol.setColor(protocolDetails.getColor());
        protocol.setMaxDataRate(protocolDetails.getMaxDataRate());
        protocol.setRange(protocolDetails.getRange());
        protocol.setPowerConsumption(protocolDetails.getPowerConsumption());
        protocol.setMetric(protocolDetails.getMetric());
        return protocolRepository.save(protocol);
    }

    public void deleteProtocol(Long id) {
        protocolRepository.deleteById(id);
    }

    public Protocol getProtocolByName(String name) {
        return protocolRepository.findFirstByName(name);
    }
}

