import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Client } from '@stomp/stompjs';

interface TrafficVisualizationProps {
  isRunning: boolean;
}

const TrafficVisualization: React.FC<TrafficVisualizationProps> = ({ isRunning }) => {
  const [data, setData] = useState<{ time: number; totalPacketsSent: number; totalEnergyConsumed: number; networkCoverage: number }[]>([])

  useEffect(() => {
    let stompClient: Client | null = null

    if (isRunning) {
      // Initialize STOMP client
      stompClient = new Client({
        brokerURL: "ws://localhost:8080/traffic-updates", // Match backend STOMP endpoint
        reconnectDelay: 5000, // Attempt reconnection every 5 seconds if disconnected
        debug: (str) => console.log(str), // Log debug information
      })

      stompClient.onConnect = () => {
        console.log("Connected to STOMP server")

        // Subscribe to the traffic topic
        stompClient?.subscribe("/topic/traffic-total", (message) => {
          try {
            const messageData = JSON.parse(message.body) // Parse the received JSON message
            console.log("Received message:", messageData) // Add a log to inspect the data

            // Ensure data structure is correct
            if (messageData.totalPacketsSent !== undefined && messageData.totalEnergyConsumed !== undefined && messageData.networkCoverage !== undefined) {
              setData((prevData) => {
                const newDataPoint = {
                  time: prevData.length > 0 ? prevData[prevData.length - 1].time + 1 : 0,
                  totalPacketsSent: messageData.totalPacketsSent,
                  totalEnergyConsumed: messageData.totalEnergyConsumed,
                  networkCoverage: messageData.networkCoverage,
                }
                const newData = [...prevData, newDataPoint]
                return newData.slice(-20) // Keep only the last 20 data points
              })
            } else {
              console.error("Invalid message structure:", messageData)
            }
          } catch (error) {
            console.error("Error parsing STOMP message:", error)
          }
        })
      }

      stompClient.onStompError = (frame) => {
        console.error("STOMP error:", frame)
        alert("STOMP connection error. Check the console for details.")
      }

      stompClient.activate()
    }

    return () => {
      if (stompClient) stompClient.deactivate()
    }
  }, [isRunning])

  useEffect(() => {
    console.log("Current data:", data) // Log the data to see if it's being updated correctly
  }, [data])

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Traffic du réseau (bits/round)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          {data.length === 0 ? (
            <p>No data available yet</p>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickFormatter={(time) =>
                  new Date(
                    new Date().setSeconds(
                      new Date().getSeconds() -
                        (data[data.length - 1]?.time - time),
                    ),
                  ).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                }
                padding={{ left: 10, right: 10 }}
                label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalPacketsSent"
                stroke="hsl(0, 70%, 50%)"
                name="taille moyenne des packets par round"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TrafficVisualization