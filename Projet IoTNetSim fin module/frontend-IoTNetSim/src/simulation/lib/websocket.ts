import { Client } from 'stompjs'

export const wsClient = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  debug: function (str) {
    console.log(str)
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
})

wsClient.onConnect = () => {
  console.log('Connected to WebSocket')
}

wsClient.onStompError = (frame) => {
  console.error('Broker reported error: ' + frame.headers['message'])
  console.error('Additional details: ' + frame.body)
}

wsClient.activate()

