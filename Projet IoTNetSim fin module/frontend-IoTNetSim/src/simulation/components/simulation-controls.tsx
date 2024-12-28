
import {useEffect, useState} from "react"
import {Button} from "./ui/button"
import {Pause, Play, Timer} from 'lucide-react'
import {cn} from "../lib/utils"

interface SimulationControlsProps {
  className?: string
  value: boolean
  onChange: (value: boolean) => void
}

export function SimulationControls({ className, value, onChange }: SimulationControlsProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [time, setTime] = useState(0)


  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isSimulating) {
      interval = setInterval(() => {
        setTime((t) => t + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSimulating])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (


    <div className={cn("flex items-center gap-4", className)}>
      <Button
        className={`text-white ${isSimulating ? 'bg-red-500' : 'bg-blue-700'}`}
        variant={isSimulating ? '#DC3545' : "default"}
        size="sm"
        onClick={() => {
          setIsSimulating(!isSimulating);
          onChange(!value);
        }}
      >
        {isSimulating ? (
          <>
            <Pause className="mr-2 h-4 w-4 text-white" />
            Stop Simulation
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4 text-white" />
            Start Simulation
          </>
        )}
      </Button>

      <div className="flex items-center gap-2 text-sm">
        <Timer className="h-4 w-4" />
        <span className="font-mono">{formatTime(time)}</span>
      </div>
    </div>

  )
}

