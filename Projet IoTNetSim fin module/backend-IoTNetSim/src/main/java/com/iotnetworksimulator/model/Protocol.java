package com.iotnetworksimulator.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Protocol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String color;
    private String maxDataRate;

    @Column(name = "sensor_range")
    private String range;
    private String powerConsumption;
    private double packetTaillemin;
    private double packetTaillemax;
    private double powerTransmission;
    private double bandwidth;
    private double sF;
    private double cR;


    @JoinColumn(name = "metric_id")
    @ManyToOne
    private Metric metric;
}

