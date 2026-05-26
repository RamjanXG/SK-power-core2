import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json());
const PORT = 3000;

// --- Hadoop Big Data Simulation Engine ---

// Generate a huge dataset of 5,000 points represent solar energy records in Pimpri Chinchwad, Maharashtra, India
interface SolarMetricPoint {
  timestamp: string;
  generation: number;
  forecast: number;
  temp: number;
  consumption: number;
}

const generateBigDataset = (points = 5000): SolarMetricPoint[] => {
  const data: SolarMetricPoint[] = [];
  const baseTime = new Date("2026-01-01T00:00:00Z");
  
  for (let i = 0; i < points; i++) {
    const time = new Date(baseTime.getTime() + i * 3600000); // Hourly data
    const hour = time.getHours();
    const seasonFactor = 1 + 0.25 * Math.sin((time.getMonth() / 12) * 2 * Math.PI); // Winter vs Summer adjustments in Pune region
    
    // Solar peaks during daylight hours in Pimpri Chinchwad
    const irradiance = hour > 6 && hour < 18 ? Math.sin(((hour - 6) / 12) * Math.PI) : 0;
    const baseGen = 650 * irradiance * seasonFactor;
    const noise = Math.random() * 45;
    const generation = parseFloat(Math.max(0, baseGen + noise).toFixed(2));
    
    // Consumption peaks during early morning and late evening
    const consumptionBase = 180 + (hour > 17 || hour < 8 ? 120 : 0);
    const consumptionNoise = Math.random() * 80;
    const consumption = parseFloat((consumptionBase + consumptionNoise).toFixed(2));
    
    data.push({
      timestamp: time.toISOString(),
      generation,
      forecast: parseFloat(Math.max(0, baseGen * 0.98 + (Math.random() - 0.5) * 15).toFixed(2)),
      temp: parseFloat((22 + irradiance * 14 + (Math.random() * 4)).toFixed(1)),
      consumption
    });
  }
  return data;
};

const solarBigData = generateBigDataset();

// Mock HDFS directory tree and standard WebHDFS parameters
interface HDFSNode {
  path: string;
  type: "FILE" | "DIRECTORY";
  size: number;
  permissions: string;
  owner: string;
  group: string;
  replication: number;
  blockSize: number;
  modificationTime: number;
  content?: string;
}

const hdfsStore: Record<string, HDFSNode> = {
  "/": {
    path: "/",
    type: "DIRECTORY",
    size: 0,
    permissions: "drwxr-xr-x",
    owner: "hdfs",
    group: "supergroup",
    replication: 0,
    blockSize: 0,
    modificationTime: Date.now()
  },
  "/user": {
    path: "/user",
    type: "DIRECTORY",
    size: 0,
    permissions: "drwxr-xr-x",
    owner: "hdfs",
    group: "supergroup",
    replication: 0,
    blockSize: 0,
    modificationTime: Date.now()
  },
  "/user/shaikh": {
    path: "/user/shaikh",
    type: "DIRECTORY",
    size: 0,
    permissions: "drwxr-xr-x",
    owner: "shaikh",
    group: "supergroup",
    replication: 0,
    blockSize: 0,
    modificationTime: Date.now()
  },
  "/user/shaikh/solar_data": {
    path: "/user/shaikh/solar_data",
    type: "DIRECTORY",
    size: 0,
    permissions: "drwxr-xr-x",
    owner: "shaikh",
    group: "supergroup",
    replication: 0,
    blockSize: 0,
    modificationTime: Date.now()
  },
  "/user/shaikh/solar_data/pimpri_chinchwad_raw.json": {
    path: "/user/shaikh/solar_data/pimpri_chinchwad_raw.json",
    type: "FILE",
    size: 142475,
    permissions: "-rw-r--r--",
    owner: "shaikh",
    group: "supergroup",
    replication: 3,
    blockSize: 134217728, // 128MB HDFS default block
    modificationTime: Date.now() - 86400000,
    content: JSON.stringify(solarBigData.slice(0, 1000))
  },
  "/user/shaikh/solar_data/panels_registry.json": {
    path: "/user/shaikh/solar_data/panels_registry.json",
    type: "FILE",
    size: 18240,
    permissions: "-rw-r--r--",
    owner: "shaikh",
    group: "supergroup",
    replication: 3,
    blockSize: 134217728,
    modificationTime: Date.now() - 3600000 * 4,
    content: JSON.stringify({ description: "Hadoop panel analytics tracking metadata", node_count: 100, cluster_region: "India-West-Pune" })
  }
};

// Simulated MapReduce Job tracking database
interface MRJob {
  id: string;
  name: string;
  inputPath: string;
  outputPath: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  progressMap: number; // 0-100
  progressReduce: number; // 0-100
  phase: "NONE" | "SPLITTING" | "MAPPING" | "SHUFFLING" | "REDUCING" | "CLEANUP";
  startTime: number;
  endTime?: number;
  mappersCount: number;
  reducersCount: number;
  metrics: {
    recordsRead: number;
    recordsWritten: number;
    bytesProcessed: number;
    hdfsBlocksLoaded: number;
  };
  resultsSummary?: {
    hourlyAverageGen: Record<string, number>;
    peakHour: string;
    peakGeneration: number;
    monthlyCarbonOffsetKg: number;
  };
}

const mapReduceJobs: MRJob[] = [
  {
    id: "job_202605211900_0001",
    name: "PimpriChinchwad_SolarMaxPeak_Yield",
    inputPath: "/user/shaikh/solar_data/pimpri_chinchwad_raw.json",
    outputPath: "/user/shaikh/solar_data/output/solar_max_peak",
    status: "COMPLETED",
    progressMap: 100,
    progressReduce: 100,
    phase: "CLEANUP",
    startTime: Date.now() - 7200000,
    endTime: Date.now() - 7180000,
    mappersCount: 4,
    reducersCount: 1,
    metrics: {
      recordsRead: 5000,
      recordsWritten: 24,
      bytesProcessed: 428190,
      hdfsBlocksLoaded: 3
    },
    resultsSummary: {
      hourlyAverageGen: {
        "08:00": 134.2,
        "10:00": 348.6,
        "12:00": 582.1,
        "14:00": 554.2,
        "16:00": 298.5
      },
      peakHour: "12:00",
      peakGeneration: 642.5,
      monthlyCarbonOffsetKg: 28540
    }
  }
];

// --- API Endpoints ---

// Simulated WebHDFS status of NameNode and DataNodes
app.get("/api/hadoop/status", (req, res) => {
  const activeNodes = [
    { name: "datanode-01.skp.pimpri.local", ip: "192.168.10.11", status: "Healthy", blocks: 142, capacity: "2.4 TB", used: "1.2 TB", lastHeartbeat: "1s ago" },
    { name: "datanode-02.skp.pimpri.local", ip: "192.168.10.12", status: "Healthy", blocks: 156, capacity: "2.4 TB", used: "940 GB", lastHeartbeat: "2s ago" },
    { name: "datanode-03.skp.pimpri.local", ip: "192.168.10.13", status: "Healthy", blocks: 139, capacity: "2.4 TB", used: "1.05 TB", lastHeartbeat: "1s ago" },
  ];

  res.json({
    nameNode: "namenode.skp.pimpri.local",
    nameNodeIP: "192.168.10.10",
    hadoopVersion: "3.3.6",
    jvmVersion: "OpenJDK 11.0.22",
    status: "ONLINE / SafeMode Off",
    uptime: "24 days 4 hours",
    hdfsSummary: {
      configuredCapacity: "7.2 TB",
      dfsUsed: "3.19 TB",
      dfsUsedPercentage: "44.3%",
      nonDfsUsed: "124 GB",
      remainingSpace: "3.88 TB",
      totalBlocks: 437,
      liveDataNodes: 3,
      deadDataNodes: 0,
      replicationFactor: 3,
      corruptBlocks: 0,
      underReplicatedBlocks: 0,
    },
    dataNodes: activeNodes,
  });
});

// LIST HDFS Directories/Files (WebHDFS LISTSTATUS equivalent)
app.get("/api/hadoop/webhdfs/list", (req, res) => {
  const directoryPath = (req.query.path as string) || "/";
  
  // Find all children matching this directory
  const children = Object.keys(hdfsStore).filter(p => {
    if (directoryPath === "/") {
      return p.startsWith("/") && p !== "/" && !p.substring(1).includes("/");
    } else {
      return p.startsWith(directoryPath) && p !== directoryPath && !p.substring(directoryPath.length + 1).includes("/");
    }
  });

  const fileStatuses = children.map(path => {
    const node = hdfsStore[path];
    return {
      pathSuffix: path.split("/").pop() || "",
      type: node.type,
      length: node.size,
      owner: node.owner,
      group: node.group,
      permission: node.permissions.replace(/^d|-/, ""),
      modificationTime: node.modificationTime,
      blockSize: node.blockSize,
      replication: node.replication
    };
  });

  res.json({
    FileStatuses: {
      FileStatus: fileStatuses
    }
  });
});

// Read the content of an HDFS File (WebHDFS OPEN equivalent)
app.get("/api/hadoop/webhdfs/read", (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath || !hdfsStore[filePath] || hdfsStore[filePath].type === "DIRECTORY") {
    return res.status(404).json({ error: "FileNotFoundException / Invalid type" });
  }

  res.json({
    path: filePath,
    node: hdfsStore[filePath],
    content: JSON.parse(hdfsStore[filePath].content || "{}")
  });
});

// Write to HDFS file system
app.post("/api/hadoop/webhdfs/write", (req, res) => {
  const { path: filePath, content, owner = "shaikh" } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: "Path requires absolute mapping string" });
  }

  hdfsStore[filePath] = {
    path: filePath,
    type: "FILE",
    size: Buffer.byteLength(content),
    permissions: "-rw-r--r--",
    owner: owner,
    group: "supergroup",
    replication: 3,
    blockSize: 134217728,
    modificationTime: Date.now(),
    content: typeof content === "object" ? JSON.stringify(content) : content
  };

  res.json({ success: true, message: `Successfully integrated HDFS file block creation at [${filePath}]` });
});

// Get List of MapReduce jobs running on YARN
app.get("/api/hadoop/mapreduce/jobs", (req, res) => {
  res.json(mapReduceJobs);
});

// Execute simulated Big Data MapReduce Job inside the local Cluster Memory
app.post("/api/hadoop/mapreduce/run", (req, res) => {
  const { name = "SolarDataGridAnalyzer", inputPath, recordsLimit = 5000 } = req.body;
  
  // Initialize a fresh MR job
  const jobId = `job_202605211900_${String(mapReduceJobs.length + 1).padStart(4, "0")}`;
  const recordSet = solarBigData.slice(0, Math.min(recordsLimit, solarBigData.length));
  
  const tempOutputDirectory = `/user/shaikh/solar_data/output/mr_${Date.now()}`;

  const newJob: MRJob = {
    id: jobId,
    name: name,
    inputPath: inputPath || "/user/shaikh/solar_data/pimpri_chinchwad_raw.json",
    outputPath: tempOutputDirectory,
    status: "PENDING",
    progressMap: 0,
    progressReduce: 0,
    phase: "SPLITTING",
    startTime: Date.now(),
    mappersCount: 4,
    reducersCount: 1,
    metrics: {
      recordsRead: recordSet.length,
      recordsWritten: 0,
      bytesProcessed: recordSet.length * 84, // Est bytes/record
      hdfsBlocksLoaded: Math.ceil((recordSet.length * 84) / 134217728) || 1
    }
  };

  mapReduceJobs.unshift(newJob);

  // Trigger non-blocking progressive execution state increments
  const steps = [
    { phase: "MAPPING", progressMap: 25, progressReduce: 0 },
    { phase: "MAPPING", progressMap: 50, progressReduce: 0 },
    { phase: "MAPPING", progressMap: 80, progressReduce: 0 },
    { phase: "MAPPING", progressMap: 100, progressReduce: 5 },
    { phase: "SHUFFLING", progressMap: 100, progressReduce: 25 },
    { phase: "REDUCING", progressMap: 100, progressReduce: 60 },
    { phase: "REDUCING", progressMap: 100, progressReduce: 90 },
    { phase: "CLEANUP", progressMap: 100, progressReduce: 100 }
  ];

  let stepIndex = 0;

  const runSimulationStep = () => {
    if (stepIndex >= steps.length) {
      // Calculate output results for reduction
      // Emulate Real Map and Reduce operation!
      // Map phase: key of hour strings, value of generation metrics
      const mappedBuckets: Record<string, number[]> = {};
      
      recordSet.forEach(pt => {
        const hour = new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (!mappedBuckets[hour]) mappedBuckets[hour] = [];
        mappedBuckets[hour].push(pt.generation);
      });

      // Reduce phase: reduce array of generation arrays to computed output parameters
      const reducedHourlyGen: Record<string, number> = {};
      let maxGen = 0;
      let peakHour = "12:00 PM";
      let totalEmittedWatts = 0;

      Object.entries(mappedBuckets).forEach(([hour, energyVals]) => {
        const sum = energyVals.reduce((a, b) => a + b, 0);
        const avg = parseFloat((sum / energyVals.length).toFixed(1));
        reducedHourlyGen[hour] = avg;

        energyVals.forEach(v => {
          if (v > maxGen) {
            maxGen = v;
            peakHour = hour;
          }
          totalEmittedWatts += v;
        });
      });

      // Estimate metrics
      const carbonSaved = parseFloat((totalEmittedWatts * 0.000475).toFixed(1)); // 0.475 kg CO2 per kWh offset

      // Write results array into the simulated HDFS store (creating output records!)
      const finalMRResultFiles = {
        _SUCCESS: "",
        "part-r-00000": JSON.stringify({
          jobId,
          description: `Consolidated MapReduce solar peak summaries across Pune Division (Pimpri Chinchwad, Maharashtra)`,
          recordsProcessed: recordSet.length,
          hourlyAverages: reducedHourlyGen,
          peakMetrics: { PeakHour: peakHour, PeakGenerationkW: maxGen },
          aggregateCarbonOffsetKg: carbonSaved
        })
      };

      hdfsStore[tempOutputDirectory] = {
        path: tempOutputDirectory,
        type: "DIRECTORY",
        size: 0,
        permissions: "drwxr-xr-x",
        owner: "shaikh",
        group: "supergroup",
        replication: 0,
        blockSize: 0,
        modificationTime: Date.now()
      };

      hdfsStore[`${tempOutputDirectory}/_SUCCESS`] = {
        path: `${tempOutputDirectory}/_SUCCESS`,
        type: "FILE",
        size: 0,
        permissions: "-rw-r--r--",
        owner: "shaikh",
        group: "supergroup",
        replication: 3,
        blockSize: 134217728,
        modificationTime: Date.now(),
        content: ""
      };

      hdfsStore[`${tempOutputDirectory}/part-r-00000`] = {
        path: `${tempOutputDirectory}/part-r-00000`,
        type: "FILE",
        size: JSON.stringify(finalMRResultFiles["part-r-00000"]).length,
        permissions: "-rw-r--r--",
        owner: "shaikh",
        group: "supergroup",
        replication: 3,
        blockSize: 134217728,
        modificationTime: Date.now(),
        content: finalMRResultFiles["part-r-00000"]
      };

      // Set Completed
      newJob.status = "COMPLETED";
      newJob.phase = "CLEANUP";
      newJob.endTime = Date.now();
      newJob.metrics.recordsWritten = Object.keys(reducedHourlyGen).length;
      newJob.resultsSummary = {
        hourlyAverageGen: reducedHourlyGen,
        peakHour: peakHour,
        peakGeneration: maxGen,
        monthlyCarbonOffsetKg: carbonSaved
      };
      
      return;
    }

    const st = steps[stepIndex];
    newJob.phase = st.phase as any;
    newJob.progressMap = st.progressMap;
    newJob.progressReduce = st.progressReduce;
    newJob.status = "RUNNING";

    stepIndex++;
    setTimeout(runSimulationStep, 400); // progressive steps every 400ms
  };

  // Run the MapReduce job chain
  setTimeout(runSimulationStep, 200);

  res.json({
    success: true,
    message: "MapReduce simulation job triggered on Hadoop YARN Cluster.",
    jobId: jobId
  });
});

// --- Vite & SPA Express Config ---

async function startServer() {
  // Vite setup for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT}`);
  });
}

startServer();
