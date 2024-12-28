import { useEffect, useState } from 'react';

const TableOne = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [protocols, setProtocols] = useState([]);

  // Récupérer les derniers utilisateurs, appareils et protocoles créés
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les derniers utilisateurs créés
        const usersResponse = await fetch('http://localhost:8080/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData.slice(-3)); // Derniers 3 utilisateurs

        // Récupérer les derniers appareils créés
        const devicesResponse = await fetch('http://localhost:8080/api/devices');
        const devicesData = await devicesResponse.json();
        setDevices(devicesData.slice(-3)); // Derniers 3 appareils

        // Récupérer les derniers protocoles créés
        const protocolsResponse = await fetch('http://localhost:8080/api/protocols');
        const protocolsData = await protocolsResponse.json();
        setProtocols(protocolsData.slice(-3)); // Derniers 3 protocoles
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Derniers Ajouts
      </h4>

      <div className="flex flex-col">
        {/* Affichage des derniers utilisateurs */}
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase text-center xsm:text-base">Utilisateur</h5>
          </div>
          <div className="p-2.5 xl:p-5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
          </div>
          <div className="p-2.5 xl:p-5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Statut</h5>
          </div>
        </div>

        {users.map((user, key) => (
          <div
            className={`grid grid-cols-3 ${
              key === users.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center justify-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.username}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.email}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">Actif</p>
            </div>
          </div>
        ))}

        {/* Affichage des derniers appareils */}
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 mt-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase text-center xsm:text-base">Appareil</h5>
          </div>
          <div className="p-2.5 xl:p-5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Type</h5>
          </div>
          <div className="p-2.5 xl:p-5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Statut</h5>
          </div>
        </div>

        {devices.map((device, key) => (
          <div
            className={`grid grid-cols-3 ${
              key === devices.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center justify-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{device.name}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{device.type}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{device.status}</p>
            </div>
          </div>
        ))}

        {/* Affichage des derniers protocoles */}
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 mt-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase text-center xsm:text-base">Protocole</h5>
          </div>
          <div className="p-2.5 xl:p-5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Vitesse Max</h5>
          </div>
          <div className="p-2.5 xl:p-5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Portée</h5>
          </div>
        </div>

        {protocols.map((protocol, key) => (
          <div
            className={`grid grid-cols-3 ${
              key === protocols.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center justify-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{protocol.name}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{protocol.maxDataRate}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{protocol.range}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
