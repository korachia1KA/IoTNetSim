import React, { useState } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb.tsx';

const AjouterUtilisateur: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Gestion des changements d'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validation des champs
  const validateForm = (): boolean => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setError('Tous les champs doivent être remplis.');
      return false;
    }

    // Optionnel: Ajouter des validations supplémentaires (par exemple, validation de l'email)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('L\'email n\'est pas valide.');
      return false;
    }

    setError('');
    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Remplacer '/api/utilisateur' par l'URL de votre API
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ username: '', email: '', password: '' }); // Réinitialiser les champs
      } else {
        throw new Error('Erreur lors de l\'ajout de l\'utilisateur.');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 xl:px-12">
        <Breadcrumb pageName="Ajouter un utilisateur" />

        <div className="flex justify-center items-center">
          <div className="w-full max-w-lg">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Ajouter un nouvel utilisateur
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  {/* Affichage des erreurs */}
                  {error && <div className="mb-4 text-red-500">{error}</div>}
                  {success && <div className="mb-4 text-green-500">Utilisateur ajouté avec succès!</div>}

                  {/* Nom d'utilisateur */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="username"
                    >
                      Nom d'utilisateur
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Nom d'utilisateur"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email de l'utilisateur"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="password"
                    >
                      Mot de passe
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Bouton de soumission */}
                  <button
                    type="submit"
                    className="w-full rounded bg-primary py-3 px-4.5 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Chargement...' : 'Ajouter l\'utilisateur'}
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

export default AjouterUtilisateur;
