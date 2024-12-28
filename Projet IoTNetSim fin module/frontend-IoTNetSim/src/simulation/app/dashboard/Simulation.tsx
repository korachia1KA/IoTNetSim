
import React, {useEffect, useState} from "react"
import {NetworkCanvas } from '../../components/network-canvas.tsx';
import {DevicePanel } from '../../components/device-panel.tsx';
import {SimulationControls } from '../../components/simulation-controls.tsx';
import EnergyMonitor from '../../components/energy-monitor.tsx';
import {ProtocolSelector } from '../../components/protocol-selector.tsx';
import {NetworkStats } from '../../components/network-stats.tsx';
import {NetworkAnalysis } from '../../components/network-analysis.tsx';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../components/ui/tabs"
import {Button } from '../../components/ui/button.tsx';
import {Maximize2, Minimize2} from 'lucide-react'
import EnergyAnalysis from '../../components/EnergyAnalysis.tsx';


export interface User {
  id: number;
  username: string;
  email: string;
  roles: string; // Optional property
}

export interface Role {
  id: number;
  name: string;
}

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null; // Parse JSON string or return null
};


export default function IoTNetworkSimulator() {
  const [selectedProtocol, setSelectedProtocol] = useState<string>("LoRa")
  const [simulationStarted, setSimulationStarted] = useState<boolean>(false);
  const userActuel = getUser();


  return (

      <div className="flex h-screen flex-col bg-gradient-to-b from-[#ffffff] to-[#f6f8fa]">
        {/* Top Navigation */}
        <header className="flex h-14 items-center border-b bg-gradient-to-r from-[#eaeaea] to-[#dcdcdc] px-4 shadow-sm">
          <div className="flex items-center gap-2">

            <div className="h-6 w-px bg-gray-300"/>
            <ProtocolSelector
                className="bg-white border border-black rounded-md shadow-sm"
                value={selectedProtocol}
                onChange={setSelectedProtocol}
            />
            <div className="h-6 w-px bg-gray-300"/>
            <SimulationControls
                className="ml-auto ml-[20px]"
                value={simulationStarted}
                onChange={setSimulationStarted}/>
          </div>

          {/* User Functionalities */}
          <div className="flex items-center ml-auto gap-4">


            <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:bg-[#d4d4d4]"
                title="Home"
                onClick={() => {
                  // Redirect to home logic
                  window.location.href = "/";
                }}
            >
              Accueil
            </Button>


          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Energy Monitor */}
          <aside className="w-90 border-r bg-white hidden lg:block overflow-auto shadow-inner">
            <EnergyAnalysis isRunning={true}></EnergyAnalysis>
          </aside>

          {/* Main Network Canvas */}
          <main id="network-canvas" className="relative flex-1 bg-white flex flex-col shadow-inner">
            <div className="flex-1 min-h-0">
              <NetworkCanvas protocol={selectedProtocol} simulation={simulationStarted} user={userActuel}/>
            </div>
            <div className="h-64 border-t lg:hidden overflow-auto bg-gray-50">
              <Tabs defaultValue="energy">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="energy"
                               className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                    Energy
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                    Stats
                  </TabsTrigger>
                  <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    Analysis
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="energy" className="h-[calc(100%-40px)]">
                  <EnergyAnalysis isRunning={true}></EnergyAnalysis>
                </TabsContent>
                <TabsContent value="stats" className="h-[calc(100%-40px)]">
                  <NetworkStats protocolName={selectedProtocol}/>
                </TabsContent>
                <TabsContent value="analysis" className="h-[calc(100%-40px)]">
                  <NetworkAnalysis/>
                </TabsContent>
              </Tabs>
            </div>
            <Button
                variant="outline"
                size="sm"
                className="absolute right-4 top-4 z-10 bg-gray-100 hover:bg-gray-200 border border-gray-300"
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    const canvasElement = document.getElementById('network-canvas');
                    canvasElement?.requestFullscreen();
                  }
                }}
            >
              {document.fullscreenElement ? (
                  <>
                    <Minimize2 className="mr-2 h-4 w-4 rotate-180"/>
                    Minimize Screen
                  </>
              ) : (
                  <>
                    <Maximize2 className="mr-2 h-4 w-4"/>
                    Full Screen
                  </>
              )}
            </Button>
          </main>

          {/* Right Sidebar - Network Stats and Analysis */}
          <aside className="w-130 border-l bg-white hidden lg:flex flex-col shadow-inner">
            <div className="overflow-auto">
              <NetworkStats protocolName={selectedProtocol}/>
            </div>
            <div className="flex-1 overflow-auto">
              <NetworkAnalysis/>
            </div>
          </aside>
        </div>

        {/* Bottom Device Panel */}
        <DevicePanel protocol={selectedProtocol}/>

        {/* Footer */}
        <footer
            className="h-12 bg-gradient-to-r from-[#eaeaea] to-[#dcdcdc] border-t flex items-center justify-between px-4 text-sm text-gray-700 shadow-md">
          <span>© {new Date().getFullYear()} IoTNetSim. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:underline">
              Terms of Service
            </a>
            <a href="/contact" className="hover:underline">
              Contact Us
            </a>
          </div>
        </footer>
      </div>
  )
}

