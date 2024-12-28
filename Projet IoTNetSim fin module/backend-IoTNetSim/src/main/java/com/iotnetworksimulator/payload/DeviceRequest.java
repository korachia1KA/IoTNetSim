package com.iotnetworksimulator.payload;

import com.iotnetworksimulator.model.Protocol;
import lombok.Data;

import javax.swing.text.Position;

@Data
public class DeviceRequest {
    private String name;
    private Protocol protocol;
    private Position position;
    private String type;
}