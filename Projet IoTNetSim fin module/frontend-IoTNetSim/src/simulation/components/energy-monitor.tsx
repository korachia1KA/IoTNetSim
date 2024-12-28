import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Client } from '@stomp/stompjs';

interface EnergyMonitorProps {
  isRunning: boolean;
}

interface EnergyData {
  time: number;
  totalPacketsSent: number;
  totalEnergyConsumed: number;
  networkCoverage: number;
  deviceId: string;
  protocol: string;
  batteryLevel: number;
}

const EnergyMonitor: React.FC<EnergyMonitorProps> = ({ isRunning }) => {
  const [data, setData] = useState<EnergyData[]>([]);
  const [deviceStats, setDeviceStats] = useState<any>({});

  useEffect(() => {
    let stompClient: Client | null = null;

    if (isRunning) {
      // Initialize STOMP client
      stompClient = new Client({
        brokerURL: "ws://localhost:8080/traffic-updates", // Match backend STOMP endpoint
        reconnectDelay: 5000, // Attempt reconnection every 5 seconds if disconnected
        debug: (str) => console.log(str), // Log debug information
      });

      stompClient.onConnect = () => {
        console.log("Connected to STOMP server");

        // Subscribe to the traffic topic
        stompClient?.subscribe("/topic/energy-consumed", (message) => {
          try {
            const messageData = JSON.parse(message.body);
            console.log("Received message:", messageData);

            // Ensure data structure is correct
            if (messageData.devices && messageData.totalEnergyConsumed !== undefined) {
              // Update device stats based on received data
              const updatedDeviceStats = messageData.devices.reduce((acc: any, device: any) => {
                acc[device.id] = {
                  ...device,
                  energyConsumption: device.energyConsumption || 0,
                  batteryLevel: device.batteryLevel || 100,
                };
                return acc;
              }, {});
              setDeviceStats(updatedDeviceStats);

              // Create new data point
              setData((prevData) => {
                const newDataPoint = {
                  time: prevData.length > 0 ? prevData[prevData.length - 1].time + 1 : 0,
                  totalPacketsSent: messageData.totalPacketsSent,
                  totalEnergyConsumed: messageData.totalEnergyConsumed,
                  networkCoverage: messageData.networkCoverage,
                  deviceId: messageData.devices[0]?.id,  // Example: take the first device's id
                  protocol: messageData.devices[0]?.protocol, // Example: take the first device's protocol
                  batteryLevel: messageData.devices[0]?.batteryLevel || 100, // Battery level of first device
                };
                const newData = [...prevData, newDataPoint];
                return newData.slice(-20); // Keep only the last 20 data points
              });
            } else {
              console.error("Invalid message structure:", messageData);
            }
          } catch (error) {
            console.error("Error parsing STOMP message:", error);
          }
        });
      };

      stompClient.onStompError = (frame) => {
        console.error("STOMP error:", frame);
        alert("STOMP connection error. Check the console for details.");
      };

      stompClient.activate();
    }

    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, [isRunning]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Consumption and Device Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) =>
                new Date(
                  new Date().setSeconds(
                    new Date().getSeconds() -
                    (data.length > 0 ? data[data.length - 1].time - time : 0)
                  )
                ).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })
              }
              label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalEnergyConsumed"
              stroke="#36CFC9"
              name="Total Energy Consumed per Round (mJ)"
            />
            <Line
              type="monotone"
              dataKey="networkCoverage"
              stroke="#FF5733"
              name="Network Coverage (%)"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4">
          <h3 className="text-sm font-semibold">Device Statistics:</h3>
          {Object.keys(deviceStats).map((deviceId) => {
            const device = deviceStats[deviceId];
            return (
              <div key={deviceId} className="flex justify-between text-xs mt-2">
                <span>{device.name} ({device.protocol})</span>
                <span>{device.energyConsumption.toFixed(2)} mJ</span>
                <span>{device.batteryLevel}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyMonitor;
