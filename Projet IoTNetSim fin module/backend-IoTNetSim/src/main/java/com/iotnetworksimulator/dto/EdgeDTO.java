package com.iotnetworksimulator.dto;

import lombok.Data;

@Data
public class EdgeDTO {
    private String id;
    private String source;
    private String target;
    private String type;
    private double distance;

}

