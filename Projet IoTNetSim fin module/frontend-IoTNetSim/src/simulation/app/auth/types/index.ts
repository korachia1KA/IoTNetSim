// Existing types...

export interface Project {
  id: string;
  name: string;
  description: string;
  devices: Device[];
  connections: Connection[];
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: string;
  sourceDevice: Device;
  targetDevice: Device;
  type: ConnectionType;
  label: string;
}

export interface Device {
  id: string;
  name: string;
  description: string;
  type: DeviceType;
  status: DeviceStatus;
  createdAt: string;
  updatedAt: string;
}

export type DeviceType = 'SENSOR' | 'ACTUATOR' | 'CONTROLLER';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';

export interface User {
  id: bigint;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'USER' ;


export type ConnectionType = 'ETHERNET' | 'WIFI' | 'BLUETOOTH' | 'ZIGBEE' | 'LORA';


export interface SimulationData {
  id: string;
  projectId: string;
  deviceId: string;
  timestamp: string;
  data: Record<string, unknown>;
}