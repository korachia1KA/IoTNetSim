import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ChartThree: React.FC = () => {
  const [state, setState] = useState({
    series: [],
    labels: [],
  });

  // Récupérer les appareils et les protocoles depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les appareils
        const devicesResponse = await fetch("http://localhost:8080/api/devices");
        const devices = await devicesResponse.json();

        // Récupérer les protocoles
        const protocolsResponse = await fetch("http://localhost:8080/api/protocols");
        const protocols = await protocolsResponse.json();

        // Compter les protocoles utilisés par les appareils
        const protocolCounts: { [key: string]: number } = {};
        devices.forEach((device: any) => {
          // Vérifier si 'protocol' est une liste et itérer
          if (Array.isArray(device.protocol)) {
            device.protocol.forEach((protocol: string) => {
              protocolCounts[protocol] = (protocolCounts[protocol] || 0) + 1;
            });
          }
        });

        // Extraire les protocoles existants
        const availableProtocols = protocols.map((protocol: any) => protocol.name);

        // Préparer les données pour le graphique
        const labels = availableProtocols;
        const series = availableProtocols.map(
          (protocol: string) => protocolCounts[protocol] || 0
        );

        setState({ labels, series });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#FF6361"],
    labels: state.labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Protocols Usage
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
