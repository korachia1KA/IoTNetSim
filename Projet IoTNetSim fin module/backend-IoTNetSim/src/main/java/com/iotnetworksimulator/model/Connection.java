package com.iotnetworksimulator.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String sourceId;
    private String targetId;
    private String connectionType;
}

