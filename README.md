# IoTNetSim

# IoT Network Simulation Platform

This platform enables users to design and simulate IoT networks with features similar to Cisco Packet Tracer. Users can add and connect IoT devices such as sensors and actuators, configure communication protocols like MQTT , and monitor real-time data traffic through WebSocket visualizations. The platform also supports detailed network analysis, providing tools to optimize IoT designs efficiently in a secure and interactive environment.

## Table of Contents
- [Software Architecture](#software-architecture)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Video Demonstration](#video-demonstration)
- [Contributing](#contributing)

## Software Architecture

![WhatsApp Image 2024-12-28 at 20 55 24](https://github.com/user-attachments/assets/8f5b3843-e55e-42d5-99a4-589f0d1741a4)


The system architecture comprises a Spring Boot backend and a React frontend, communicating via REST APIs. WebSocket is used for real-time traffic visualization.
## Docker Image
sh
version: '3'
services:
  mysql:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: iotnetsim
    ports:
      - "3306:3306"

  backend:
    build:
      context: ./backend-IoTNetSim
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_started
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/iotnetsim
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    healthcheck:
      test: "/usr/bin/mysql --user=root --password=root --execute \"SHOW DATABASES;\""
      interval: 5s
      timeout: 2s
      retries: 100

  frontend:
    build:
      context: ./frontend-IoTNetSim
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_started

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "8081:80"
### Backend
The backend manages device configurations, network setup, and simulation processing. It includes:
1. **Controllers**: Handle API requests for device and network operations.
2. **Models**: Represent entities like IoT devices, sensors, actuators, and connections.
3. **Repositories**: Interface with the MySQL database for CRUD operations.
4. **Services**: Contain the core logic for simulation and communication protocol handling.

### Frontend
The React-based frontend provides:
- Intuitive UI for device placement and configuration.
- Real-time traffic visualization using WebSocket.

### Database
MySQL stores information on devices, users, and network setups. Schema auto-generation is handled by Spring Data JPA.

---

## Features
- **User Authentication**: Secure login and registration.
- **Device Addition**: Add devices like smart lights, sensors, and routers.
- **Network Configuration**: Set device IPs, SSIDs, and passwords.
- **Protocol Simulation**: Supports MQTT.
- **Traffic Visualization**: Real-time data packets flow displayed via WebSocket.
- **Start/Stop Simulation**: Buttons to control the simulation state.

---

## Technologies Used
### Backend:
- **Spring Boot**
- **MySQL**
- **WebSocket**

### Frontend:
- **React**
- **HTML/CSS**
- **TS**

---

## Getting Started
Here are step-by-step instructions to get your project up and running locally:
### Prerequisites:
1. *Git:*
   - Make sure you have Git installed. If it is not installed, download and install it from [git-scm.com](https://git-scm.com/).

2. *XAMPP:*
   - Install XAMPP from [apachefriends.org](https://www.apachefriends.org/).
   - Start the Apache and MySQL servers in XAMPP.
   - Ensure MySQL is using port 3306.

3. *Node Version Manager (NVM):*
   - Install NVM from [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm).
   - Use NVM to install Node.js version 14.11.0: nvm install 14.11.0.

### Steps:
1. Clone the repository:
    bash
    git clone <repository_url>
    cd <project_directory>
    
2. Setup the Backend:
    - Navigate to the backend directory:
      bash
      cd backend-IotNetSim
      
    - Install dependencies:
      bash
      mvn clean install
      
    - Run the backend:
      bash
      mvn spring-boot:run
      
    - Verify the backend at [http://localhost:8080](http://localhost:8080).

3. Setup the Frontend:
    - Navigate to the frontend directory:
      bash
      cd frontend-IotNetSim
      
    - Install dependencies:
      bash
      npm install
      
    - Run the frontend:
      bash
      npm run dev
      
    - Access the app at [http://localhost:3000](http://localhost:3000).

---

## Video Demonstration
(Optional) Record a video or screencast showcasing:
- Adding and connecting IoT devices.
- Configuring protocols like MQTT or HTTP.
- Real-time traffic visualization.

Ensure the video adheres to the following:
- MP4 format, max 150MB.
- Dimensions: 640x480 at 30 FPS.

Validate the video at [Elsevier's Video Validator](http://elsevier-apps.sciverse.com/GadgetVideoPodcastPlayerWeb/verification).

---

## Contributing
1. Fork the repository.
2. Create a new branch:
    bash
    git checkout -b feature-name
    
3. Commit your changes:
    bash
    git commit -m "Add feature-name"
    
4. Push to your branch:
    bash
    git push origin feature-name
    ```
5. Create a pull request for review.

---
## Contributors
- Abdelghafour Korachi ([GitHub](https://github.com/korachia1KA/))
- Youness ait moh  ([GitHub](https://github.com/AIT-MOH-Youness/))
