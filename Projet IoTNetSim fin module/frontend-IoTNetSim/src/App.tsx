import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Chart from './pages/Chart';
import About from './pages/Dashboard/About.tsx';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Manage from './pages/Manage.tsx';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Register from './simulation/app/register/register';
import Login from './simulation/app/login/login';
import PersonalizedLayout from './layout/PersonalizedLayout.tsx';
import Simulation from './pages/Simulation/Simulation.tsx';
import PersonalizedErrorLayout from './layout/PersonalizedErrorLayout.tsx';
import AjouterUtilisateur from './components/Ajouter/AjouterUtilisateur.tsx';
import AjouterAppareil from './components/Ajouter/AjouterAppareil.tsx';
import AjouterProtocole from './components/Ajouter/AjouterProtocole.tsx';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : !token ? (
    pathname === '/auth/signup' ? (
      <Register />
    ) : (
      <Login />
    )
  ) : (
    <Routes>
      <Route
        index
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Dashboard" />
              <About />
            </DefaultLayout>
          </>
        }
      />

      <Route
        path="/profile"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Profile" />
              <Profile />
            </DefaultLayout>
          </>
        }
      />
      <Route
        path="/forms/form-elements"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Form Elements" />
              <FormElements />
            </DefaultLayout>
          </>
        }
      />
      <Route
        path="/forms/form-layout"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Form Layout" />
              <FormLayout />
            </DefaultLayout>
          </>
        }
      />
      <Route
        path="/users/add"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - ajouter user" />
              <AjouterUtilisateur />
            </DefaultLayout>
          </>
        }
      />

      <Route
        path="/devices/add"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Ajouter Appareil" />
              {/* Replace 'AjouterAppareil' with the correct component for adding devices */}
              <AjouterAppareil />
            </DefaultLayout>
          </>
        }
      />
      <Route
        path="/protocols/add"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Ajouter Protocole" />
              {/* Replace 'AjouterProtocole' with the correct component for adding protocols */}
              <AjouterProtocole />
            </DefaultLayout>
          </>
        }
      />

      <Route
        path="/tables"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Gestion" />
              <Manage />
            </DefaultLayout>
          </>
        }
      />
      <Route
        path="/settings"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Settings" />
              <Settings />
            </DefaultLayout>
          </>
        }
      />
      <Route
        path="/simulation"
        element={
          !token ? (
            <>
              <PageTitle title="IoTNetSim - Signin" />
              <Login />
            </>
          ) : (
            <>
              <PersonalizedLayout>
                <PageTitle title="IoTNetSim - Simulation Dashboard" />
                <Simulation />
              </PersonalizedLayout>
            </>
          )
        }
      />
      <Route
        path="/chart"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Basic Chart" />
              <Chart />
            </DefaultLayout>
          </>
        }
      />
      <Route
        path="*"
        element={
          <>
            <PersonalizedErrorLayout>
              <PageTitle title="IoTNetSim - Alerts" />
              <Alerts />
            </PersonalizedErrorLayout>
          </>
        }
      />
      <Route
        path="/ui/buttons"
        element={
          <>
            <DefaultLayout>
              <PageTitle title="IoTNetSim - Buttons" />
              <Buttons />
            </DefaultLayout>
          </>
        }
      />
      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="IoTNetSim - Simulation" />
            <Simulation />
          </>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="IoTNetSim - Simulation" />
            <Simulation />
          </>
        }
      />
    </Routes>
  );
}

export default App;
