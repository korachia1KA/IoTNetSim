
import {useEffect, useState} from "react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "./ui/select"
import {Radio} from "lucide-react"

interface ProtocolSelectorProps {
  value: string
  onChange: (value: string) => void
}

interface ProtocolOption {
  id: string
  name: string
}

export function ProtocolSelector({ value, onChange }: ProtocolSelectorProps) {
  const [protocols, setProtocols] = useState<ProtocolOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch protocol options from the API
    const fetchProtocols = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/protocols")
        if (response.ok) {
          const data = await response.json()
          setProtocols(data)
        } else {
          console.error("Failed to fetch protocols")
        }
      } catch (error) {
        console.error("Error fetching protocols:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProtocols()
  }, [])

  return (
      <div className="flex items-center gap-2">
        <Radio className="h-4 w-4 text-gray-500" />
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Select Protocol" />
          </SelectTrigger>
          <SelectContent>
            {protocols.map((protocol) => (
              <SelectItem
                key={protocol.id}
                value={protocol.name}
              >
                {protocol.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
  )
}
