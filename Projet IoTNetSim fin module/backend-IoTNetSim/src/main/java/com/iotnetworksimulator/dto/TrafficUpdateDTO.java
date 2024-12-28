package com.iotnetworksimulator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class TrafficUpdateDTO {
    private double totalPacketsSent;
    private double totalEnergyConsumed;
    private double networkCoverage;

}