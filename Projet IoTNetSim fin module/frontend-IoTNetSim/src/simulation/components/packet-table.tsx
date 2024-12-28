import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

const packets = [
  {
    id: 1,
    source: "Camera-1",
    destination: "Server-1",
    protocol: "MQTT",
    size: "256 bytes",
    time: "12:00:00",
  },
  {
    id: 2,
    source: "Sensor-1",
    destination: "Gateway-1",
    protocol: "CoAP",
    size: "64 bytes",
    time: "12:00:01",
  },
]

export function PacketTable() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Protocol</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packets.map((packet) => (
            <TableRow key={packet.id}>
              <TableCell>{packet.source}</TableCell>
              <TableCell>{packet.destination}</TableCell>
              <TableCell>{packet.protocol}</TableCell>
              <TableCell>{packet.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

