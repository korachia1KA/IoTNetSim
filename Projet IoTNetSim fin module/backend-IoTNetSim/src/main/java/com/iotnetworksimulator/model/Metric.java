package com.iotnetworksimulator.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Metric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @OneToMany(mappedBy = "metric", cascade = CascadeType.ALL)
//    private List<Protocol> protocols;
}

