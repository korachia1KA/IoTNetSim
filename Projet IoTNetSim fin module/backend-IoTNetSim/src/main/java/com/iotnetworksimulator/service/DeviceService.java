package com.iotnetworksimulator.service;

import com.iotnetworksimulator.model.Device;
import com.iotnetworksimulator.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    public Device addDevice(Device device) {
        return deviceRepository.save(device);
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Device updateDevice(Long id, Device deviceDetails) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        device.setName(deviceDetails.getName());
        device.setType(deviceDetails.getType());
        device.setProtocol(deviceDetails.getProtocol());
        device.setBatteryLevel(deviceDetails.getBatteryLevel());
        device.setEnergyConsumption(deviceDetails.getEnergyConsumption());
        device.setStatus(deviceDetails.getStatus());
        device.setX(deviceDetails.getX());
        device.setY(deviceDetails.getY());

        return deviceRepository.save(device);
    }

    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }
}

