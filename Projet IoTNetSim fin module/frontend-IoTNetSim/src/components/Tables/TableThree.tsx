import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Définition des types
interface User {
  id: number;
  username: string;
  email: string;
}

interface Device {
  id: number;
  name: string;
  type: string;
  protocol: string;
  batteryLevel: number;
  fabricator: string;
  energyConsumption: number;
  status: string;
}

interface Protocol {
  id: number;
  name: string;
  color: string;
  maxDataRate: string;
  range: string;
  powerConsumption: string;
  packetTaillemin: number;
  packetTaillemax: number;
  powerTransmission: number;
  bandwidth: number;
  sF: number;
  cR: number;
}



const TableThree: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [usersRes, devicesRes, protocolsRes] = await Promise.all([
          fetch('http://localhost:8080/api/users'),
          fetch('http://localhost:8080/api/devices'),
          fetch('http://localhost:8080/api/protocols'),
        ]);

        if (!usersRes.ok || !devicesRes.ok || !protocolsRes.ok) {
          throw new Error('Failed to fetch data from one or more APIs.');
        }

        const usersData = await usersRes.json();
        const devicesData = await devicesRes.json();
        const protocolsData = await protocolsRes.json();

        setUsers(usersData);
        setDevices(devicesData);
        setProtocols(protocolsData);
      } catch (err) {
        setError('An error occurred while fetching the data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete User
  const handleDeleteUser = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        setError('Failed to delete the user.');
      }
    } catch (err) {
      setError('An error occurred while deleting the user.');
    }
  };

  // Delete Device
  const handleDeleteDevice = async (deviceId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDevices(devices.filter((device) => device.id !== deviceId));
      } else {
        setError('Failed to delete the device.');
      }
    } catch (err) {
      setError('An error occurred while deleting the device.');
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-6 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-3">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {error && <p className="text-red-500">{error}</p>}

          {/* Table des utilisateurs */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-xl font-semibold text-black dark:text-white">
              <br />
              <br />
              Les Utilisateurs
            </h3>
            <div className="flex justify-end mb-6">
              <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/users/add')}>
                Ajouter
              </span>
            </div>
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
              {['Utilisateur', 'Email', 'Action'].map((header, index) => (
                <div key={index} className="p-3 xl:p-6 text-center">
                  <h5 className="text-sm font-medium uppercase">{header}</h5>
                </div>
              ))}
            </div>
            {users.map((user) => (
              <div
                className="grid grid-cols-3 border-b border-stroke dark:border-strokedark"
                key={user.id}
              >
                <div className="flex items-center justify-center p-3 xl:p-6">
                  {user.username}
                </div>
                <div className="flex items-center justify-center p-3 xl:p-6">
                  {user.email}
                </div>
                <div className="flex items-center justify-center p-3 xl:p-6">
                  <button className="text-green-500 mr-4">Modifier</button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table des appareils */}
          <div className="flex flex-col mt-4">
            <h3 className="mb-6 text-xl font-semibold text-black dark:text-white">
              <br />
              <br />
              Les Devices
            </h3>
            <div className="flex justify-end mb-6">
              <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/devices/add')}>
                Ajouter
              </span>
            </div>
            <div className="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4">
              {[
                'Nom',
                'Type',
                'Protocole',
                'Énergie',
                'Fabricant',
                'Statut',
                'Action',
              ].map((header, index) => (
                <div key={index} className="p-3 xl:p-6 text-center">
                  <h5>{header}</h5>
                </div>
              ))}
            </div>
            {devices.map((device) => (
              <div
                className="grid grid-cols-7 border-b border-stroke dark:border-strokedark"
                key={device.id}
              >
                <div className="flex items-center justify-center p-3 xl:p-6">
                  {device.name}
                </div>
                <div className="flex items-center justify-center p-3 xl:p-6">
                  {device.type}
                </div>
                <div className="flex items-center justify-center p-3 xl:p-6">
                  {device.protocol}
                </div>
                <div className="flex items-center justify-center p-3 xl:p-6">
                  {device.energyConsumption}
                </div>
                <div className="flex items-center justify-center p-3 xl:p-6">
                  {device.fabricator}
                </div>
                <div className="flex items-center justify-center p-3 xl:p-6">
                  {device.status}
                </div>
                <div className="flex items-center justify-center p-3 xl:p-6">
                  <button className="text-green-500 mr-4" >Modifier</button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table des protocoles */}
          <div className="flex flex-col mt-8">
            <h3 className="mb-6 text-2xl font-bold text-black dark:text-white">
              <br />
              <br />
              Les Protocoles
            </h3>
            <div className="flex justify-end mb-6">
              <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/protocols/add')}>
                Ajouter
              </span>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {[
                    'Nom',
                    'Vitesse Max',
                    'Portée',
                    "Consommation d'énergie",
                    'Taille Min',
                    'Taille Max',
                    'Puissance',
                    'Bande',
                    'SF',
                    'CR',
                    'Action',
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 font-medium text-gray-800 dark:text-white"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
                </thead>
                <tbody>
                {protocols.map((protocol, idx) => (
                  <tr
                    key={protocol.id}
                    className={
                      idx % 2 === 0
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-gray-50 dark:bg-gray-900'
                    }
                  >
                    <td className="px-6 py-4">{protocol.name}</td>
                    <td className="px-6 py-4">{protocol.maxDataRate}</td>
                    <td className="px-6 py-4">{protocol.range}</td>
                    <td className="px-6 py-4">{protocol.powerConsumption}</td>
                    <td className="px-6 py-4">{protocol.packetTaillemin}</td>
                    <td className="px-6 py-4">{protocol.packetTaillemax}</td>
                    <td className="px-6 py-4">
                      {protocol.powerTransmission}
                    </td>
                    <td className="px-6 py-4">{protocol.bandwidth}</td>
                    <td className="px-6 py-4">{protocol.sF}</td>
                    <td className="px-6 py-4">{protocol.cR}</td>
                    <td className="px-6 py-4">
                      <button className="text-green-500 hover:underline mr-4">
                        Modifier
                      </button>
                      <button className="text-red-500 hover:underline">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableThree;
