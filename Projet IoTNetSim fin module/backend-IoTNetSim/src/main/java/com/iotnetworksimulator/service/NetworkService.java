package com.iotnetworksimulator.service;

import com.iotnetworksimulator.dto.EdgeDTO;
import com.iotnetworksimulator.dto.NetworkRequestDTO;
import com.iotnetworksimulator.dto.NodeDTO;
import com.iotnetworksimulator.dto.TrafficUpdateDTO;
import com.iotnetworksimulator.model.Protocol;
import com.iotnetworksimulator.repository.ProtocolRepository;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class NetworkService {

    private final SimpMessagingTemplate messagingTemplate;
    private final MqttClient mqttClient;

    double packetsSent;
    double energyConsumed;
    double coverage;
    String lastMods;


    @Autowired
    ProtocolRepository protocolRepository;

    @Autowired
    public NetworkService(SimpMessagingTemplate messagingTemplate, MqttClient mqttClient) {
        this.messagingTemplate = messagingTemplate;
        this.mqttClient = mqttClient;
    }

    public void processNetworkData(NetworkRequestDTO request) {
        Protocol protocol = protocolRepository.findFirstByName(request.getProtocol());
        List<NodeDTO> nodes = request.getNodes();
        List<EdgeDTO> edges = request.getEdges();
        String nowMods = "("+request.getProtocol()+")";

        packetsSent=0;
        energyConsumed=0;
        coverage=0;

        if (!nowMods.equals(lastMods)) {
            packetsSent=0;
            energyConsumed=0;
            coverage=0;
            lastMods=nowMods;
        }
        
        int nbrEdges = edges.size();

        for (EdgeDTO edge : edges) {
            switch (request.getProtocol()) {
                case "LoRa":
                    // Specific behavior for LoRa
                    if(edge.getDistance()<15000); // Example logic
                    nbrEdges--;
                    break;

                case "ZigBee":
                    // Specific behavior for ZigBee
                    if(edge.getDistance()<100); // Example logic
                    nbrEdges--;
                    break;

                case "NB-IoT":
                    // Specific behavior for NB-IoT
                    if(edge.getDistance()<100); // Example logic
                    nbrEdges--;
                    break;

                default:
                    break;
            }
        }

        // Variables pour les contraintes
        Random random = new Random();


        // Simuler la communication MQTT pour chaque nœud
        for (NodeDTO node : nodes) {

            // Publier les données du nœud sur MQTT
            String topic = "iot/traffic/" + node.getId();

            if(node.getType()!="networkDevice"){
                String payload = String.format(
                        "{\"id\": \"%s\", \"info\": %s, \"value\": %d}",
                        node.getId() ,node.getType(), random.nextInt(50)
                );
                publishToMqtt(topic, payload);
                double packetActuel = random.nextDouble(protocol.getPacketTaillemin(),protocol.getPacketTaillemax())*edges.size();
                packetsSent = packetsSent + packetActuel;
                double dataRate = (protocol.getSF()*protocol.getBandwidth())/(Math.pow(2,protocol.getSF()));
                double tempsTransmission = packetActuel/dataRate;
                double energyActuel = protocol.getPowerTransmission()*tempsTransmission*edges.size();
                energyConsumed = energyConsumed + energyActuel/1000;
            }

        }

        // Calculer la couverture réseau
        coverage = calculateNetworkCoverage(edges);

        if(coverage==0){
            packetsSent=0;
            energyConsumed=0;
        }



        // Envoyer les mises à jour au frontend via WebSocket
        sendTrafficData(packetsSent, energyConsumed, coverage);
    }

    private double calculateNetworkCoverage(List<EdgeDTO> edges) {

        Random random = new Random();

        double totalDistance = edges.stream().mapToDouble(EdgeDTO::getDistance).sum();
        double avgCoverage = (totalDistance / edges.size())*(totalDistance / edges.size())*3.14;
        return ( (avgCoverage)+random.nextDouble(0.4)*(avgCoverage)); // Moyenne de couverage
    }

    private void publishToMqtt(String topic, String payload) {
        try {
            MqttMessage message = new MqttMessage(payload.getBytes());
            mqttClient.publish(topic, message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendTrafficData(double totalPackets, double energyConsumed, double coverage) {
        // DTO pour le trafic total
        TrafficUpdateDTO trafficDTO = new TrafficUpdateDTO(totalPackets, 0, 0);
        messagingTemplate.convertAndSend("/topic/traffic-total", trafficDTO);

        // DTO pour l'énergie consommée
        TrafficUpdateDTO energyDTO = new TrafficUpdateDTO(0, energyConsumed, 0);
        messagingTemplate.convertAndSend("/topic/energy-consumed", energyDTO);

        // DTO pour la couverture réseau
        TrafficUpdateDTO coverageDTO = new TrafficUpdateDTO(0, 0, coverage);
        messagingTemplate.convertAndSend("/topic/network-coverage", coverageDTO);
    }
}
