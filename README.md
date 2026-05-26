# SK Power Core: Industrial Solar Grid Hub & Hadoop Big Data Simulator

SK Power Core is a resilient, modern, full-stack monitoring and analytics command center designed for the regional power grids of **Pimpri Chinchwad, Maharashtra, India**. The system supervises 100 industrial solar collection units, rendering high-fidelity telemetry, forecasting, peak analysis, security logs, and a fully functional big data simulation suite modeled after the **Apache Hadoop Ecosystem**.



Next-gen industrial solar grid monitoring powered by real-time predictive AI and distributed big data analytics.

Repository Description:

An enterprise-grade Industrial Solar Grid Monitoring & Hadoop Big Data Analytics Platform. Built with React, TypeScript, Node.js, and Tailwind CSS, featuring real-time telemetry tracking, predictive AI failure forecasting, and MapReduce-inspired distributed log processing simulations.

Suggested Topics / Tags:
solar-energy industrial-iot big-data hadoop-simulation react-typescript nodejs real-time-monitoring predictive-analytics data-visualization vite tailwind-css clean-architecture

📝 Complete README.md Source Code
Markdown
# ☀️ SK Power Core

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Apache_Hadoop-EEEEEE?style=for-the-badge&logo=apachehadoop&logoColor=CC292B" alt="Hadoop" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

**SK Power Core** is an enterprise-grade, AI-powered Industrial Solar Grid Monitoring and Big Data Analytics Platform. Designed to bridge the gap between high-frequency hardware telemetry and large-scale industrial data processing, it offers real-time grid asset monitoring alongside a robust, conceptual simulation of Apache Hadoop's core storage and computation layers.

Whether monitoring photovoltaic efficiency, predicting inverter failures via analytical models, or processing millions of simulated grid logs using decentralized data structures, SK Power Core provides a highly interactive and practical view into modern IoT industrial operations.

---

## 🚀 Key Features

### 📊 1. Real-Time Telemetry & Grid Monitoring
* **Live Dashboards:** Track crucial metrics such as current voltage ($V$), active current ($A$), total generation ($kW/h$), and inverter temperatures across multiple solar sub-stations.
* **Geospatial Asset Tracking:** High-level dynamic tracking of distributed physical solar nodes to locate faults or production degradation instantly.

### 🧠 2. AI-Driven Industrial Analytics
* **Predictive Asset Maintenance:** Machine learning-inspired regressions to predict thermal anomalies and component degradation risks before physical hardware failures occur.
* **Efficiency Optimization:** Intelligent anomaly-detection algorithms flagging dirt accumulation, shading effects, or grid mismatch patterns.

### 📦 3. Hadoop Big Data Simulation Suite
* **HDFS Log Processing Layer:** A hands-on visualizer simulating a distributed Hadoop Distributed File System, mimicking NameNode metadata management and DataNode block replications.
* **MapReduce Analytics engine:** Run localized analytical jobs mapping solar hardware system logs into key-value intervals, aggregating high-volume metrics into streamlined reporting structures.

---

## 🛠️ Tech Stack

| Component | Technology | Primary Use Case |
| :--- | :--- | :--- |
| **Frontend UI** | `React 18` + `Vite` | Fast, lightweight rendering engine for data-heavy views. |
| **Type Safety** | `TypeScript` | Bulletproof compile-time safety across streams and telemetry shapes. |
| **Styling** | `Tailwind CSS` | Clean, highly custom industrial-grade dark mode dashboard layouts. |
| **Backend Runtime**| `Node.js` + `Express` | Serving analytical APIs, static datasets, and handling system commands. |
| **State & Charts** | `Context API` + `Recharts` | Managing global cluster state and rendering high-performance live time-series graphs. |
| **Big Data Paradigm**| `Hadoop Concepts` | Simulated MapReduce frameworks and distributed data-block managers written in pure TS. |

---

## 🏗️ Architecture Overview

The system is constructed based on a decoupling pattern matching modern IoT frameworks:

[ Solar Grid Telemetry / Hardware Logs ]
│
▼
[ Node.js API Layer ]
│
┌───────────────┴───────────────┐
▼                               ▼
[ React Dashboard View ]    [ Hadoop Analytics Engine ]
• Live Charts UI            • Simulated HDFS Cluster
• Fault Maps                • MapReduce Engine Jobs
• Predictive Alerts         • Structured Log Exports


1. **Ingestion Mocking:** Telemetry generators create realistic data payloads modeling physical grid disruptions and weather anomalies.
2. **HDFS Storage Emulator:** Breaks analytical log streams into distinct data blocks, tracking data replication status across virtual racks.
3. **MapReduce Processor:** Processes large-scale log histories to calculate aggregated yield trends without locking main UI interactions.

---

## 📸 Screenshots & Interface Playbook

*Below are structural representations of what you'll experience in the user interface:*

#### 🖥️ Main Analytical Dashboard
+-------------------------------------------------------------------------+
| [⚡ SK POWER CORE]   Nodes: Active (14) Faulty (2)     [User Profile]   |
+-------------------------------------------------------------------------+
|  [Total Output]      [Grid Efficiency]   [Active AI Alerts]             |
|   420.89 kW/h         94.2%               ⚠️ Inverter Node 4 Thermal Overheat|
+-------------------------------------------------------------------------+
|                                                                         |
|  [📈 Live Time-Series Power Gen Chart]                                  |
|  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  |
|                                                                         |
+-------------------------------------------------------------------------+

*(Placeholder for actual application screenshot: Add your image asset to `public/screenshots/dashboard.png` and update link)*

#### 🗄️ Hadoop Distributed File System Visualizer
+-------------------------------------------------------------------------+
| [NameNode Meta Manager]                                                 |
| File: solar_log_2026_05.csv (Size: 128MB) Block Size: 64MB              |
+-------------------------------------------------------------------------+
|  [DataNode-01 (Rack A)]  --> Block 1 [Replica A]  🟩 Healthy            |
|  [DataNode-02 (Rack A)]  --> Block 2 [Replica A]  🟩 Healthy            |
|  [DataNode-03 (Rack B)]  --> Block 1 [Replica B]  🟩 Healthy            |
+-------------------------------------------------------------------------+

*(Placeholder for actual application screenshot: Add your image asset to `public/screenshots/hadoop-hdfs.png` and update link)*

---

## ⚙️ Installation & Setup

### Prerequisites
Ensure your local development machine has the following tools installed:
* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Step 1: Clone the Repository
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/sk-power-core.git](https://github.com/YOUR_GITHUB_USERNAME/sk-power-core.git)
cd sk-power-core
Step 2: Set Up Backend Services
Navigate to the backend folder and install required dependencies:

Bash
cd backend
npm install
Create a basic .env file in the root of the backend folder:

Code snippet
PORT=5000
NODE_ENV=development
Step 3: Set Up Frontend Client
Open a new terminal window, navigate back to the project root, then enter the client workspace:

Bash
cd client
npm install
🏃 How to Run Locally
Running the Full Application Stack
For ease of development, you can run both environments independently.

Boot Up the Analytical Engine Backend:

Bash
cd backend
npm run dev
The backend instance will initialize and listen on http://localhost:5000.

Launch the Vite Development Frontend Client:

Bash
cd client
npm run dev
Vite will spin up the interface, usually at http://localhost:5173 or http://localhost:3000.

Open your preferred browser and navigate to the local Vite URL to interact with the system live.

📂 Project Directory Structure
Plaintext
sk-power-core/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Processes analytical reports and system configurations
│   │   ├── routes/        # API endpoints serving static and active mock logs
│   │   └── server.ts      # App execution entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── assets/        # System icons and static media assets
│   │   ├── components/    # Reusable user interface cards, charts, and tables
│   │   ├── context/       # Global state for grid systems and simulation runners
│   │   ├── views/         # Dashboard, Hadoop UI, and Predictive Analytics views
│   │   ├── App.tsx        # Base layout wiring and view routers
│   │   └── main.tsx       # Application mounting file
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
🗺️ Future Roadmap & Enhancements
[ ] Physical Hardware Integration: Introduce active WebSockets to map directly to real ESP32 microcontroller data streams.

[ ] Advanced MapReduce Tuning: Implement multi-threaded web-worker systems to execute custom user-written javascript MapReduce scripts entirely inside the sandboxed UI.

[ ] Docker Containerization: Dockerize the client-server environment for seamless, uniform cross-platform deployments with one-click orchestration commands.

📄 License
This industrial analytics system is distributed completely under the terms of the MIT License. Check the LICENSE file for additional parameters.
