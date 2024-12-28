package com.iotnetworksimulator;

import com.iotnetworksimulator.model.Device;
import com.iotnetworksimulator.model.ERole;
import com.iotnetworksimulator.model.Metric;
import com.iotnetworksimulator.model.Role;
import com.iotnetworksimulator.repository.DeviceRepository;
import com.iotnetworksimulator.repository.MetricRepository;
import com.iotnetworksimulator.repository.ProtocolRepository;
import com.iotnetworksimulator.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class IoTNetworkSimulatorApplication {


    public static void main(String[] args) {
        SpringApplication.run(IoTNetworkSimulatorApplication.class, args);
    }

//    @Bean
//    public Role role(RoleRepository roleRepository) {
//        roleRepository.save(new Role(ERole.ROLE_ADMIN));
//        return roleRepository.save(new Role(ERole.ROLE_USER));
//    }

}

