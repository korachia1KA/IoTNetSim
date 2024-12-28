

export const api = {
  async createDevice(device: any) {
    const response = await fetch('http://localhost:8080/api/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(device),
    })
    return response.json()
  },

  async createConnection(connection: any) {
    const response = await fetch('http://localhost:8080/api/devices/connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connection),
    })
    return response.json()
  },

  async getTopology() {
    const response = await fetch('http://localhost:8080/api/devices/topology')
    return response.json()
  },
}

