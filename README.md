# SK Power Core: Industrial Solar Grid Hub & Hadoop Big Data Simulator

SK Power Core is a resilient, modern, full-stack monitoring and analytics command center designed for the regional power grids of **Pimpri Chinchwad, Maharashtra, India**. The system supervises 100 industrial solar collection units, rendering high-fidelity telemetry, forecasting, peak analysis, security logs, and a fully functional big data simulation suite modeled after the **Apache Hadoop Ecosystem**.

---

## 🚀 Key Feature Sets

1. **Pimpri Chinchwad Solar Grid Dashboard**
   - Active tracking of solar efficiency, real-time power generation (kW), and consumption metrics.
   - Comprehensive asset grid profiling 100 individual PV collector arrays.
2. **Forecasting & Peak Load Intelligence**
   - Diurnal and seasonal weather trends mapping standard meteorological effects in the Pune Division.
   - Advanced correlation analysis comparing industrial peak demands and peak yield generation.
3. **Integrated Hadoop Big Data Hub**
   - **Cluster Topology Monitor:** Real-time health check on the primary `NameNode` and active parallel `DataNode` storage groups.
   - **HDFS Browser:** Interactive implementation of WebHDFS metadata, allowing folder traversal and streaming JSON outputs directly from selected HDFS data blocks.
   - **MapReduce (YARN):** Simulates massive workflow splitting, mapping, shuffling, and reduction over thousands of collection rows to calculate peak load averages and carbon footprint offsets.
4. **Resiliency Security Operations**
   - Fault registries and automated diagnostics indicators to address low energy states or hardware errors.

---

## 🛠️ Architecture & Technologies

- **Frontend:** React 18 / TypeScript, Tailwind CSS, Lucide icons, Framer Motion animations, Recharts visualizations.
- **Backend:** Express Server (Node.js) acting as both the API proxy gateway and the virtual Big Data MapReduce processor.
- **Build Pipeline:** Vite + Esbuild compilation bundling Server assets into self-contained ESM/CJS output.

---

## 🏁 Quick Start & Run Instructions

### 1. Prerequisites
Ensure you have the following installed on your host machine:
* [Node.js](https://nodejs.org/) (Version 18.0 or high recommended)
* [npm](https://www.npmjs.com/) (bundled with Node)

### 2. Install Dependencies
Navigate to the root directory and run:
```bash
npm install
```

### 3. Start Development Server
This boots up the local TypeScript Express server with live Vite-integrated middleware:
```bash
npm run dev
```
Once executed, the application will bind to host `0.0.0.0` and port `3000`:
👉 **Open [http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Production Build & Start
Compile the client static assets and bundle the backend typescript server using the optimization steps:
```bash
npm run build
```
Once the compilation succeeds, spin up the bundled Node instance:
```bash
npm start
```
This serves the optimized distribution assets located inside `/dist`.

**Happy Coding! ⚡️**
