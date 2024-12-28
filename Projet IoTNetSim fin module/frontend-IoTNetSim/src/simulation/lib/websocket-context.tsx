
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { Client } from 'stompjs'

interface WebSocketContextType {
  client: Client | null
  isConnected: boolean
  subscribe: (destination: string, callback: (message: any) => void) => void
  unsubscribe: (destination: string) => void
  publish: (destination: string, body: any) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  client: null,
  isConnected: false,
  subscribe: () => {},
  unsubscribe: () => {},
  publish: () => {},
})

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const wsClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    wsClient.onConnect = () => {
      console.log('Connected to WebSocket')
      setIsConnected(true)
      // Resubscribe to all previous subscriptions
      subscriptions.forEach((_, destination) => {
        subscribe(destination, () => {})
      })
    }

    wsClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket')
      setIsConnected(false)
    }

    wsClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message'])
      console.error('Additional details: ' + frame.body)
    }

    wsClient.activate()
    setClient(wsClient)

    return () => {
      wsClient.deactivate()
    }
  }, [])

  const subscribe = (destination: string, callback: (message: any) => void) => {
    if (client && isConnected) {
      const subscription = client.subscribe(destination, (message) => {
        callback(JSON.parse(message.body))
      })
      setSubscriptions(prev => new Map(prev.set(destination, subscription.id)))
    }
  }

  const unsubscribe = (destination: string) => {
    if (client && isConnected) {
      const subscriptionId = subscriptions.get(destination)
      if (subscriptionId) {
        client.unsubscribe(subscriptionId)
        setSubscriptions(prev => {
          const newMap = new Map(prev)
          newMap.delete(destination)
          return newMap
        })
      }
    }
  }

  const publish = (destination: string, body: any) => {
    if (client && isConnected) {
      client.publish({ destination, body: JSON.stringify(body) })
    }
  }

  return (
    <WebSocketContext.Provider value={{ client, isConnected, subscribe, unsubscribe, publish }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(WebSocketContext)

