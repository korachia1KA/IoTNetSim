import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Pour obtenir l'ID de l'utilisateur à partir de l'URL
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null; // Analyser la chaîne JSON ou retourner null
};

const user = getUser();

const Settings = () => {
  const { userId } = useParams(); // Récupérer l'ID de l'utilisateur à partir de l'URL
  const navigate = useNavigate(); // Pour naviguer après la soumission du formulaire
  const [formData, setFormData] = useState({
    password: '', // Laisser vide initialement
    username: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données de l'utilisateur par ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${user.id}`,
        );
        if (!response.ok) {
          throw new Error('Échec de la récupération des données utilisateur');
        }
        const data = await response.json();
        setFormData({
          password: '', // Ne pas définir le mot de passe récupéré
          username: data.username || '',
          bio: data.bio || '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  // Gérer les changements dans les champs de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      if (!formData.password) {
        delete updatedData.password; // Omettre le champ mot de passe si non modifié
      }

      console.log('Sending data:', updatedData); // Add this line to inspect the data you're sending

      const response = await fetch(
        `http://localhost:8080/api/users/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error('Échec de la mise à jour de l\'utilisateur');
      }

      // Après la mise à jour réussie, mettre à jour les données de l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify({
        ...user,  // Garder les autres informations de l'utilisateur
        username: updatedData.username,
        bio: updatedData.bio,
        // Si le mot de passe a été modifié, vous pouvez l'ajouter ici si nécessaire
      }));

      alert('Utilisateur mis à jour avec succès');
      navigate('/profile'); // Rediriger vers la liste des utilisateurs ou une autre page

      window.location.reload();
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <>
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 xl:px-12">
        <Breadcrumb pageName="Modifier le profil" />

        <div className="flex justify-center items-center">
          <div className="w-full max-w-lg">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Modifier les informations de l'utilisateur
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
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
                      type="password" // Type défini sur "password" pour masquer
                      name="password"
                      id="password"
                      placeholder="Entrer votre nouveau ou encien mot de passe pour verifier"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* BIO */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="bio"
                    >
                      BIO
                    </label>
                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      name="bio"
                      id="bio"
                      placeholder="Bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded bg-primary py-3 px-4.5 text-white"
                  >
                    Enregistrer les modifications
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

export default Settings;
