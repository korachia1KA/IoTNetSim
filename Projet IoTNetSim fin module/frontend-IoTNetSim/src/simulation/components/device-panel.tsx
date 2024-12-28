
import {ScrollArea} from "./ui/scroll-area"
import clsx from "clsx"
import {
  Atom,
  Camera,
  Diameter,
  Heater,
  Lightbulb,
  Radio,
  Router,
  SettingsIcon,
  ThermometerIcon,
  WatchIcon
} from "lucide-react";

interface DeviceType {
  id: number
  name: string
  icon: React.ReactNode
  type: string
  protocol: string[]
}

const devices: DeviceType[] = await fetch('http://localhost:8080/api/devices')
    .then(response => response.json())
    .then(data => data.map((device: DeviceType) => ({
      ...device,
      icon: (() => {
        switch (device.type.toLowerCase()) {
          case "networkdevice":
            if(device.name === "Router")
              return <Router className="h-8 w-8"/>;
            else if(device.name === "Hub")
              return <SettingsIcon className="h-8 w-8"/>;
          case "temperature":
            return <ThermometerIcon className="h-8 w-8"/>;
          case "light":
          case "lumiere":
            return <Lightbulb className="h-8 w-8"/>;
          case "camera":
            return <Camera className="h-8 w-8"/>;
          case "gaz":
            return <Atom className="h-8 w-8"/>;
          case "fummee":
          case "heat":
            return <Heater className="h-8 w-8"/>;
          case "ultrasonic":
          case "ultrasonore":
          case "ultrasonor":
          case "distance":
            return <Diameter className="h-8 w-8"/>;
          case "humidity":
          case "humidite":
            return <WatchIcon className="h-8 w-8"/>;
          default:
            return <Radio className="h-8 w-8"/>;
        }
      })()
    })))
    .catch(() => []);


// Initialize a list of devices with example data
// const devices: DeviceType[] = [
//   {
//     id: "1",
//     name: "Router",
//     icon: <Router className="h-8 w-8" />,
//     type: "networkDevice",
//     protocol: ["LoRa", "Zigbee", "NB-IoT"],
//   },
// ];

interface DevicePanelProps {
  protocol: string
}

export function DevicePanel({protocol}: DevicePanelProps) {
  const filteredDevices = devices.filter(device =>
      device.protocol.includes(protocol)
  )


  const onDragStart = (
      event: React.DragEvent,
      nodeType: string,
      nodeName: string,
      nodeIcon: React.ReactNode,
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.setData("application/reactflow-name", nodeName)
    event.dataTransfer.setData("application/reactflow-icon", JSON.stringify(nodeIcon))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
      <div
          className={clsx(
              "border-t p-4 bg-[#f5f5f5]"
          )}
      >
        <ScrollArea className="w-full">
          <div className="flex gap-4">
            {filteredDevices.map((device) => (
                <div
                    key={device.name}
                    draggable
                    onDragStart={(e) => onDragStart(e, device.type, device.name,device.icon)}
                    className={clsx(
                        "flex cursor-move flex-col items-center gap-2 rounded-lg border p-4 transition-colors bg-white-800 hover:bg-white-700 border-gray-600 hover:border-gray-500"

                    )}
                >
                  {device.icon}
                  <span
                      className={clsx(
                          "text-xs font-medium text-black"
                      )}
                  >
                {device.name}
                    <br/>
                {device.type}
              </span>
                </div>
            ))}
          </div>
        </ScrollArea>
      </div>
  )
}

