
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import CoverageAnalysis from "../components/CoverageAnalysis";
import EnergyAnalysis from "../components/EnergyAnalysis";
import TrafficVisualization from "../components/TrafficVisualization";
import { useWebSocket } from "../lib/websocket-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface NetworkData {
  timestamp: number
  traffic: number
  energyEfficiency: number
  coverage: number
}

export function NetworkAnalysis() {
  const { isConnected, subscribe, unsubscribe } = useWebSocket()
  const [data, setData] = useState<NetworkData[]>([])
  const [trafficData, setTrafficData] = useState<NetworkData[]>([])
  const [energyData, setEnergyData] = useState<NetworkData[]>([])
  const [coverageData, setCoverageData] = useState<NetworkData[]>([])

  useEffect(() => {
    if (isConnected) {
      subscribe('/topic/network-analysis', (newData: NetworkData) => {
        setData((prev) => [...prev.slice(-20), newData])

        // Separate the data for each tab based on the type
        if (newData.traffic !== undefined) {
          setTrafficData((prev) => [...prev.slice(-20), newData])
        }
        if (newData.energyEfficiency !== undefined) {
          setEnergyData((prev) => [...prev.slice(-20), newData])
        }
        if (newData.coverage !== undefined) {
          setCoverageData((prev) => [...prev.slice(-20), newData])
        }
      })

      return () => {
        unsubscribe('/topic/network-analysis')
      }
    }
  }, [isConnected, subscribe, unsubscribe])

  return (
      <Card className="h-[450px]">
        <CardHeader>
          <CardTitle>Network Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="traffic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="coverage">Coverage</TabsTrigger>
            </TabsList>

            <TabsContent value="traffic">
              <TrafficVisualization isRunning={true}></TrafficVisualization>
            </TabsContent>
            <TabsContent value="energy">
              <EnergyAnalysis isRunning={true}></EnergyAnalysis>
            </TabsContent>
            <TabsContent value="coverage">
              <CoverageAnalysis isRunning={true}></CoverageAnalysis>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
  )
}
