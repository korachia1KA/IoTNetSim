package com.iotnetworksimulator.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String type;
    private String protocol;
    private Long batteryLevel;
    private String fabricator;
    private double energyConsumption;
    private String status;
    
    @Column(name = "x_position")
    private double x;
    
    @Column(name = "y_position")
    private double y;
}

