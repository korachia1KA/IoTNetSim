
import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import {Thermometer, Lock, Radio} from 'lucide-react'
import { cn } from "../lib/utils"

const deviceIcons = {
  temperature: Thermometer,
  door: Lock,
}

export const SensorNode = memo(({ data, selected }: NodeProps) => {
  const Icon = deviceIcons[data.deviceType as keyof typeof deviceIcons] || Radio

  return (
      <div
          className={cn(
              "flex h-20 w-20 flex-col items-center justify-center rounded-lg border bg-background p-2 shadow-sm transition-colors",
              selected && "border-primary"
          )}
      >
          <Handle type="target" position={Position.Top} className="!bg-primary"/>
          <Icon className="h-8 w-8"/>
          <span className="mt-1 text-xs font-medium">{data.label}</span>
          <span className="mt-1 text-xs font-medium">{data.type}</span>
          <Handle type="source" position={Position.Bottom} className="!bg-primary"/>
      </div>
  )
})
SensorNode.displayName = "SensorNode"

