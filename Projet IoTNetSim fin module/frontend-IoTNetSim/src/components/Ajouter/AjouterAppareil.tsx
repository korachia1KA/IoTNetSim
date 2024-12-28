import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb.tsx';

const AjouterAppareil: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [protocols, setProtocols] = useState<string[]>([]); // Liste des protocoles
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]); // Protocoles sélectionnés
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [fabricator, setFabricator] = useState('');
  const [energyConsumption, setEnergyConsumption] = useState(0);
  const [status, setStatus] = useState('Active'); // Statut par défaut
  const [error, setError] = useState('');

  // Récupérer les protocoles de l'API
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/protocols');
        const data = await response.json();
        // Extraire uniquement les noms des protocoles
        const protocolNames = data.map((protocol: { name: string }) => protocol.name);
        setProtocols(protocolNames);
      } catch (err) {
        console.error('Failed to fetch protocols:', err);
      }
    };

    fetchProtocols();
  }, []);

  // Gestion des changements dans les champs de texte
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'fabricator':
        setFabricator(value);
        break;
      case 'energyConsumption':
        setEnergyConsumption(Number(value));
        break;
      default:
        break;
    }
  };

  // Gestion des changements dans le select des protocoles
  const handleProtocolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedProtocols(selectedOptions);
  };

  // Gestion du changement de statut
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type || selectedProtocols.length === 0 || !fabricator || status === '' || energyConsumption === null) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          protocols: selectedProtocols, // Protocoles sous forme de tableau
          batteryLevel,
          fabricator,
          energyConsumption,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Échec de l\'ajout de l\'appareil.');
      }

      // Réinitialiser le formulaire après soumission réussie
      setName('');
      setType('');
      setFabricator('');
      setEnergyConsumption(0);
      setStatus('Active');
      setSelectedProtocols([]);
      setBatteryLevel(100);
      setError('');
      alert('Appareil ajouté avec succès!');
    } catch (err) {
      setError('Une erreur est survenue lors de l\'ajout de l\'appareil.');
    }
  };

  return (
    <>
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 xl:px-12">
        <Breadcrumb pageName="Ajouter un appareil" />

        <div className="flex justify-center items-center">
          <div className="w-full max-w-lg">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Ajouter un nouvel appareil
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  {/* Nom de l'appareil */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="name"
                    >
                      Nom de l'appareil
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Nom de l'appareil"
                      value={name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Type de l'appareil */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="type"
                    >
                      Type de l'appareil
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      name="type"
                      id="type"
                      placeholder="Type de l'appareil"
                      value={type}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Sélection des protocoles */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="protocols"
                    >
                      Protocoles
                    </label>
                    <select
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      name="protocols"
                      id="protocols"
                      multiple
                      value={selectedProtocols}
                      onChange={handleProtocolChange}
                    >
                      {protocols.map((protocol) => (
                        <option key={protocol} value={protocol}>
                          {protocol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fabricant */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fabricator"
                    >
                      Fabricant
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      name="fabricator"
                      id="fabricator"
                      placeholder="Fabricant de l'appareil"
                      value={fabricator}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Consommation d'énergie */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="energyConsumption"
                    >
                      Consommation d'énergie
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="number"
                      name="energyConsumption"
                      id="energyConsumption"
                      placeholder="Consommation d'énergie (en W)"
                      value={energyConsumption}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Statut */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="status"
                    >
                      Statut
                    </label>
                    <select
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      name="status"
                      id="status"
                      value={status}
                      onChange={handleStatusChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Nonactive">Nonactive</option>
                    </select>
                  </div>

                  {/* Error Message */}
                  {error && <p className="text-red-500 mb-3">{error}</p>}

                  <button
                    type="submit"
                    className="w-full rounded bg-primary py-3 px-4.5 text-white"
                  >
                    Ajouter l'appareil
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AjouterAppareil;
