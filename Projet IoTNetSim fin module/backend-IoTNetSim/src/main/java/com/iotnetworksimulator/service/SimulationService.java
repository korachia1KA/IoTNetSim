package com.iotnetworksimulator.service;

import com.iotnetworksimulator.model.Device;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class SimulationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private DeviceService deviceService;

    private Random random = new Random();

    @Scheduled(fixedRate = 1000)
    public void simulateNetworkTraffic() {
        List<Device> devices = deviceService.getAllDevices();
        
        for (Device device : devices) {
            // Simulate battery drain
            device.setBatteryLevel((long) Math.max(0, device.getBatteryLevel() - random.nextDouble() * 0.1));
            
            // Simulate energy consumption
            device.setEnergyConsumption(device.getEnergyConsumption() + random.nextDouble() * 0.5);
            
            // Simulate status changes
            if (random.nextDouble() < 0.1) {
                device.setStatus(random.nextBoolean() ? "ONLINE" : "OFFLINE");
            }
            
            deviceService.updateDevice(device.getId(), device);
        }
        
        // Send updates to clients
        messagingTemplate.convertAndSend("/topic/devices", devices);
        
        // Simulate network analysis data
        double traffic = random.nextDouble() * 100;
        double energyEfficiency = random.nextDouble() * 100;
        double coverage = 80 + random.nextDouble() * 20;
        
        messagingTemplate.convertAndSend("/topic/network-analysis", 
            Map.of(
                "timestamp", System.currentTimeMillis(),
                "traffic", traffic,
                "energyEfficiency", energyEfficiency,
                "coverage", coverage
            ));
    }
}

