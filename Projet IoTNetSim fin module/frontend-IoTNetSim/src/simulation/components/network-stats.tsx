
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity, Signal } from "lucide-react";

interface ProtocolData {
  id: number;
  name: string;
  color: string;
  maxDataRate: string;
  range: string;
  powerConsumption: string;
  packetTaillemin: number;
  packetTaillemax: number;
  powerTransmission: number;
  bandwidth: number;
  sF: number;
  cR: number;
}

interface NetworkStatsProtocol {
  protocolName: string;
}

export function NetworkStats({ protocolName }: NetworkStatsProtocol) {
  const [currentProtocol, setCurrentProtocol] = useState(protocolName);
  const [protocol, setProtocol] = useState<ProtocolData | null>(null);



  useEffect(() => {
    setCurrentProtocol(protocolName);
  }, [protocolName]);

  useEffect(() => {
    // Fetch protocol data dynamically from the API
    const fetchProtocol = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/protocols/${protocolName}`);
        if (response.ok) {
          const protocolData = await response.json();
          setProtocol(protocolData);
        } else {
          console.error(`Failed to fetch protocol: ${currentProtocol}`);
        }
      } catch (error) {
        console.error("Error fetching protocol data:", error);
      }
    };

    fetchProtocol();
  }, [currentProtocol]);

  if (!protocol) {
    return <div>Loading protocol data...
    <br/>
    </div>;
  }

  return (
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Network Statistics</h2>
          <Badge
              variant="outline"
              className={`bg-${protocol.color}-900 text-${protocol.color}-200 border-${protocol.color}-700`}
          >
            {currentProtocol}
          </Badge>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm">
                <Signal className="mr-2 h-4 w-4" />
                Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{protocol.range}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm">
                <Activity className="mr-2 h-4 w-4" />
                Max Data Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{protocol.maxDataRate}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm">
                <Activity className="mr-2 h-4 w-4" />
                Power Consumption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{protocol.powerConsumption}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm">
                <Activity className="mr-2 h-4 w-4" />
                Bandwidth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{protocol.bandwidth} MHz</div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
