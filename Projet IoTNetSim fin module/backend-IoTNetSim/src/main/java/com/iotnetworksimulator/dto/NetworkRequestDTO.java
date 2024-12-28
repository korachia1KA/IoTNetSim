package com.iotnetworksimulator.dto;

import lombok.Data;

import java.util.List;


@Data
public class NetworkRequestDTO {

    private List<NodeDTO> nodes;
    private List<EdgeDTO> edges;
    private String protocol;

}
