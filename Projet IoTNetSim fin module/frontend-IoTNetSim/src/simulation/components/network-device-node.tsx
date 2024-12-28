
import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Router, Wifi } from 'lucide-react'
import { cn } from "../lib/utils"

const deviceIcons = {
  router: Router,
  switch: Router,
  "access-point": Wifi,
}

export const NetworkDeviceNode = memo(({ data, selected }: NodeProps) => {
  const Icon = deviceIcons[data.deviceType as keyof typeof deviceIcons] || Router

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
        <span className="mt-1 text-xs font-medium">{data.deviceType}</span>
        <span className="mt-1 text-xs font-medium">{data.protocol}</span>
        <Handle type="source" position={Position.Bottom} className="!bg-primary"/>
      </div>
  )
})
NetworkDeviceNode.displayName = "NetworkDeviceNode"

