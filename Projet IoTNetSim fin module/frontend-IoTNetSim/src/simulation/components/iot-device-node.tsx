
import {memo} from "react"
import {Handle, NodeProps, Position} from "reactflow"
import {Camera, Cpu, Lightbulb, Radio, Smartphone,} from 'lucide-react'
import {cn} from "../lib/utils"

const deviceIcons = {
  camera: Camera,
  light: Lightbulb,
  controller: Cpu,
  endpoint: Smartphone,
}



export const IoTDeviceNode = memo(({ data, selected }: NodeProps) => {
  const Icon = deviceIcons[data.deviceType as keyof typeof deviceIcons] || Radio

  return (
      <div
          className={cn(
              "flex h-24 w-24 flex-col items-center justify-center rounded-lg border bg-white p-2 shadow-sm transition-colors",
              selected && "border-blue-500 shadow-md",
              data.protocol === "LoRa" && "border-purple-200",
              data.protocol === "Zigbee" && "border-red-200",
              data.protocol === "NB-IoT" && "border-blue-200"
          )}
      >
        <Handle
            type="target"
            position={Position.Top}
            className="!bg-blue-500"
        />
        <Icon className="h-8 w-8"/>
        <span className="mt-1 text-xs font-medium">{data.label}</span>
        <span className="mt-1 text-xs font-medium">{data.type}</span>
        <span className="mt-1 text-xs font-medium">{data.deviceType}</span>
        <span className="mt-1 text-xs font-medium">{data.protocol}</span>
      </div>
  )
})
IoTDeviceNode.displayName = "IoTDeviceNode"

