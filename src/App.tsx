/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { 
  LayoutDashboard, 
  LayoutGrid,
  Activity, 
  Zap, 
  TrendingUp, 
  CloudSun, 
  Settings, 
  Bell, 
  Download, 
  Sun, 
  Battery, 
  AlertTriangle, 
  ChevronRight,
  Menu,
  X,
  User,
  Clock,
  Thermometer,
  CloudLightning,
  BarChart3,
  Search,
  CheckCircle2,
  Moon,
  Database,
  Cpu,
  Network,
  FileCode,
  Play,
  FileText,
  Folder,
  ArrowLeft,
  Server,
  Sliders,
  BellRing,
  ShieldX,
  BookOpen,
  HelpCircle,
  Info,
  ChevronDown,
  Sparkles,
  Flame,
  Book,
  Compass,
  Terminal,
  ShieldAlert,
  Lightbulb,
  Check,
  Award,
  AlertCircle,
  MessageSquare,
  Send,
  Heart,
  List
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  Cell,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DASHBOARD_BACKGROUNDS = [
  {
    id: 'villa',
    name: 'Sunset Eco-Villa',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    author: 'SunCore Smart Residence',
    desc: 'Luxury smart house with integrated solar arrays in a gorgeous sunset field'
  },
  {
    id: 'field',
    name: 'Solar Array Farm',
    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1600&auto=format&fit=crop',
    author: 'Solar Valley Tracker',
    desc: 'Dense industrial photovoltaic arrays capturing glorious sunset golden hour rays'
  },
  {
    id: 'turbines',
    name: 'Wind & Solar Plant',
    url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1600&auto=format&fit=crop',
    author: 'Eco Power Grid',
    desc: 'Stunning renewable power landscape blending turbines and solar panels under a majestic sky'
  },
  {
    id: 'macro',
    name: 'Silicon Power Cell',
    url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1600&auto=format&fit=crop',
    author: 'Silicon Crystalline Core',
    desc: 'Close-up texture of deep blue high-voltage semiconductor junctions'
  },
  {
    id: 'grid',
    name: 'Teal Grid Network',
    url: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1600&auto=format&fit=crop',
    author: 'High-Glow Energy Transmitor',
    desc: 'Abstract neon wave glow alignment with shimmering grid patterns'
  },
  {
    id: 'eco-forest',
    name: 'Bio Green Canopy',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
    author: 'Green Canopy Filtration',
    desc: 'Fresh golden rays warming a pristine forest microclimate canopy'
  }
] as const;

// --- Types ---
interface GenerationPoint {
  time: string;
  generation: number;
  forecast: number;
  temp: number;
  consumption: number;
}

interface Panel {
  id: string;
  name: string;
  status: 'Active' | 'Charging' | 'Maintenance' | 'Faulty';
  engineers: string[];
  irradiance: number;
  energy: string;
  battery: number;
  temperature: number;
  healthIssue?: 'Low Energy' | 'Needs Cleaning' | 'Cell Failure' | 'None';
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  message: string;
  time: string;
}

// --- Mock Data Generator ---
const generateData = (points: number = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    const hour = time.getHours();
    const day = time.getDay();
    
    // Seasonal and diurnal patterns
    const diurnal = hour > 6 && hour < 18 ? Math.sin((hour - 6) * Math.PI / 12) : 0;
    const seasonal = 1 + 0.2 * Math.sin(time.getMonth() * Math.PI / 6);
    
    const baseGen = 500 * diurnal * seasonal;
    const noise = Math.random() * 50 * (diurnal + 0.1);
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      generation: Math.max(0, baseGen + noise),
      forecast: Math.max(0, baseGen * 0.98 + (Math.random() - 0.5) * 20),
      temp: 15 + (diurnal * 15) + (Math.random() * 5),
      consumption: 200 + (Math.random() * 150) + (hour > 17 || hour < 8 ? 100 : 0)
    });
  }
  return data;
};

// Generate 5000 points for "Big Data" simulation
const INITIAL_DATA = generateData(2000);

// Generate 100 panels for large-scale asset management
const GENERATE_PANELS = (): Panel[] => {
  const panels: Panel[] = [];
  const prefixes = ['AH', 'LO', 'DE', 'HT', 'XK', 'TR'];
  const statuses: Panel['status'][] = ['Active', 'Active', 'Active', 'Charging', 'Maintenance', 'Faulty'];
  const issues: Panel['healthIssue'][] = ['None', 'None', 'None', 'None', 'Low Energy', 'Needs Cleaning', 'Cell Failure'];

  for (let i = 1; i <= 100; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const issue = status === 'Active' || status === 'Charging' ? issues[Math.floor(Math.random() * issues.length)] : (status === 'Maintenance' ? 'Cell Failure' : 'Low Energy');
    
    panels.push({
      id: i.toString(),
      name: `${prefix}-${Math.floor(Math.random() * 9 + 1)}x${Math.floor(Math.random() * 9 + 1)}`,
      status: status,
      engineers: [`E${Math.floor(Math.random() * 20 + 1)}`, `E${Math.floor(Math.random() * 20 + 1)}`],
      irradiance: Number((Math.random() * 200).toFixed(2)),
      energy: `${(Math.random() * 100 + 10).toFixed(2)}Wh`,
      battery: Math.floor(Math.random() * 100),
      temperature: Number((30 + Math.random() * 15).toFixed(1)),
      healthIssue: issue
    });
  }
  return panels;
};

const PANELS = GENERATE_PANELS();

const MOCK_ALERTS: Alert[] = [
  { id: '1', type: 'warning', message: 'Low voltage detected in Panel Cluster B4', time: '10 mins ago' },
  { id: '2', type: 'error', message: 'Inverter #02 critical failure - System bypass active', time: '2 hrs ago' },
  { id: '3', type: 'success', message: 'Daily generation target reached', time: '24 mins ago' },
  { id: '4', type: 'info', message: 'Routine maintenance scheduled for May 15', time: '1 day ago' },
];

// --- Help & Documentation / User Guide Constants ---
const SMART_TIPS = [
  "SK Power Core leverages Hadoop MapReduce optimization jobs to dynamically reschedule energy storage transfers during peak grid pricing.",
  "HDFS files are split into massive blocks (default 128MB) replicated 3x across the datacenter to prevent data loss even if a cell rack fails.",
  "Solar panel efficiency drops by roughly 0.4% for every degree Celsius above 25°C. Cooling systems protect panel longevity.",
  "The Forecasting module uses a mathematical model combining regional cloud density, dust attenuation, orbital solar zenith angle, and thermal coefficient factors.",
  "Hadoop SafeMode is a read-only state entered on startup, while the NameNode verifies that at least 99.9% of all data blocks are correctly replicated."
];

interface ManualSection {
  id: string;
  title: string;
  category: string;
  desc: string;
  bullets: { title: string; desc: string; detail?: string }[];
  didYouKnow?: string;
  keywords: string[];
}

const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: "intro",
    title: "1. Introduction to SK Power Core",
    category: "Get Started",
    desc: "Welcome to SK POWER CORE, the world's most advanced clean energy grid and big data analysis dashboard. Designed for control centers, grid operator panels, and asset managers, this platform consolidates operational telemetry with heavy-weight enterprise big data machinery.",
    bullets: [
      {
        title: "What is SK Power Core",
        desc: "A unified, full-stack hybrid energy network platform. It coordinates utility-scale solar photovoltaic clusters, battery backup systems, and grid load distributors for continuous peak optimization.",
        detail: "SK Power Core operates across multiple states, ensuring real-time energy flow is measured in kilowatts (kW) and aggregated storage is managed in megawatt-hours (MWh)."
      },
      {
        title: "Smart Grid Analytics",
        desc: "Uses advanced math modeling to monitor high-frequency electrical fluctuation and pre-emptively forecast energy curves.",
        detail: "By analyzing conditions like sun tracking angles, dust coverage (transmissivity indicators), and panel ambient temperatures, the platform balances overall network impedance."
      },
      {
        title: "Hadoop Cluster Integration",
        desc: "The grid processes petabytes of raw high-frequency telemetry. This is stored directly on a secure virtual Apache Hadoop Distributed File System (HDFS).",
        detail: "Hadoop is an standard industrial framework for storing and analyzing massive log streams, ensuring no operational metrics are ever lost."
      },
      {
        title: "Real-Time Monitoring Operations",
        desc: "Interactive monitoring widgets refresh continuously, tracking voltage thresholds, grid frequencies, and immediate alarms.",
        detail: "This lets first-time operators inspect and toggle systems instantly without exposing delicate electrical subsystems to unsafe configurations."
      }
    ],
    didYouKnow: "SK Power Core registers sub-millisecond grid telemetry and aggregates them into hourly batches to trigger instant load balancing.",
    keywords: ["intro", "introduction", "about", "sk power core", "smart grid", "hadoop", "real-time", "analytics", "clean energy"]
  },
  {
    id: "nav",
    title: "2. Navigation & Interface Architecture",
    category: "Interface Guide",
    desc: "The platform's interface is divided into professional functional workspaces. Each sidebar panel focuses on a dedicated aspect of solar array power management and cluster operations.",
    bullets: [
      {
        title: "Dashboard Overview",
        desc: "Your main control center displaying live energy generation gauges, weather diagnostics, current battery state-of-charge, and the critical Grid Frequency chart.",
        detail: "Ideal for an at-a-glance operational status assessment, proving immediately if grid generation is in sync."
      },
      {
        title: "Asset Tracking Map & Grid",
        desc: "An exhaustive diagnostic matrix of 100 industrial collector panels. Track unit status, ambient cell temperatures, individual battery charges, and engineer roster logs.",
        detail: "Lets operators search and filter specific solar panels by unit ID, current performance status, or localized hardware faults."
      },
      {
        title: "Forecasting Simulation Console",
        desc: "An advanced modeling sandbox. Toggle slider valves for solar irradiance, cloud layer thickness, dust accumulation, and cell temperatures to project future generation curves.",
        detail: "Generates real-time custom charts illustrating output ceilings depending on environmental factors."
      },
      {
        title: "Peak Analysis Panel",
        desc: "A specialized tool for studying energy load distribution and grid stress triggers during peak hours.",
        detail: "Provides immediate simulation of battery discharge storage pipelines to offset peak load stress and lower economic utility expenses."
      },
      {
        title: "Reports Tab (Operative Statements)",
        desc: "Download historic daily operations statements, view weekly carbon mitigation summaries, and inspect rolling monthly audits without value savings indicators.",
        detail: "Allows operators to change dates, view historic logs, and export operating data into CSV or JSON spreadsheets directly."
      },
      {
        title: "Big Data Hub (Hadoop Terminal)",
        desc: "Interactive panel mapping HDFS cluster status, YARN resource configurations, node topology, and scheduling MapReduce optimization jobs.",
        detail: "Lets you browse folders, write simulation configs, and launch compute jobs to crunch millions of grid records."
      },
      {
        title: "Security & Threshold Console",
        desc: "Monitors active intrusion containment channels, manages system event firewall logs, and allows customized incident alert generation.",
        detail: "Used to simulate warning flags to test operator emergency drills and grid lockdown protocols."
      },
      {
        title: "Settings Configurations",
        desc: "Manage main interface atmospheres (such as Deep Space Dark mode or Light view), toggles operational safety parameters, and hosts this comprehensive manual.",
        detail: "Includes automated thermal throttle switches to restrict panel damage under extreme heat."
      }
    ],
    didYouKnow: "You can toggle the sidebar open or closed with the hamburger button in the top-left corner to gain wider screen space on dense charts.",
    keywords: ["sidebar", "navigation", "dashboard", "asset tracking", "forecasting", "reports", "big data", "hadoop", "security", "settings"]
  },
  {
    id: "hadoop",
    title: "3. Apache Hadoop Big Data Core",
    category: "Heavy Tech Manual",
    desc: "Understanding our high-volume operational backend. As telemetry streams from thousands of solar arrays, we host them on a robust distributed filesystem.",
    bullets: [
      {
        title: "Hadoop Distributed File System (HDFS)",
        desc: "The primary virtual storage engine. It structures streaming grid metrics across multiple server ranks to ensure extreme durability.",
        detail: "HDFS handles file-system hierarchy virtualizations and lets operators browse compiled logs via an interactive HDFS file browser."
      },
      {
        title: "YARN (Yet Another Resource Negotiator)",
        desc: "The cluster operating system and job scheduling mechanism.",
        detail: "YARN dynamically provisions memory allocations and CPU resources across individual datanode units to prevent cluster exhaustion."
      },
      {
        title: "MapReduce Framework",
        desc: "Our high-scale batch processing mechanism. Slices gargantuan datasets into parallel tasks, maps them to local nodes, and aggregates values into small reports.",
        detail: "Runs optimization computations to flag which panels need maintenance or determine when the battery must feed secondary grids."
      },
      {
        title: "NameNode (Master Node)",
        desc: "The master control system of HDFS. It keeps the core directory map and knows exactly where each file block is stored.",
        detail: "If the primary NameNode turns unresponsive, a hot standby backup assumes master operations."
      },
      {
        title: "DataNode (Storage Worker Node)",
        desc: "DataNodes are local machines storing block payloads. They send continuous sub-second heartbeat pings to indicate health.",
        detail: "Our simulated cluster maps three main virtual nodes: datanode-01, -02, and -03, tracking active storage allocations."
      },
      {
        title: "Block Count & Replication Policy",
        desc: "To guarantee protection, files are indexed as sequential blocks (128MB each) replicated 3x across distinct cluster racks.",
        detail: "If any single virtual server fails, HDFS automatically rebuilds its blocks elsewhere from remaining replications."
      },
      {
        title: "DFS Used & Free Capacity",
        desc: "Refers to active HDFS storage metrics. We track write-operations to make sure physical SAN disks are never saturated.",
        detail: "The Big Data dashboard graphs exact allocation percentages to warn you when offloading log tables is advised."
      },
      {
        title: "Hadoop SafeMode Protocol",
        desc: "An emergency start-up state where the NameNode locks writes and evaluates if overall block replication counts meet safety requirements.",
        detail: "SafeMode turns off once blocks check out at least 99.9% replicated. Manual override is in the Big Data dashboard."
      },
      {
        title: "Cluster Grid Topology & HDFS Browser",
        desc: "Illustrates the rack placement of hardware systems, and lets operators click through virtual folders in HDFS to preview CSV operational metrics.",
        detail: "Includes custom MapReduce peak optimizers, letting you select record scopes and submit simulated batches."
      }
    ],
    didYouKnow: "MapReduce jobs split the input log sets into a Map phase (for custom filtering) and a Reduce phase (for totaling yield results) to finish in seconds.",
    keywords: ["hdfs", "yarn", "mapreduce", "namenode", "datanode", "block", "replication", "safemode", "cluster topology", "browser", "job"]
  },
  {
    id: "metrics",
    title: "4. Metric Keys & KPI Indexing",
    category: "Reference Guide",
    desc: "SK Power Core operates on key performance gauges. Beginners should memorize these terms to correctly assess real-time system performance:",
    bullets: [
      {
        title: "Grid Load Index",
        desc: "Measured in gigawatts (GW). Tracks the cumulative consumption of local factories, residential sinks, and transport networks currently fed.",
        detail: "If grid load exceeds localized solar capacity plus battery thresholds, supplemental turbine feeds are automatically scheduled."
      },
      {
        title: "Carbon Mitigations (Saved)",
        desc: "Calculates the exact volume of carbon dioxide (CO2) prevented from being spat into the atmosphere, measured in metric tons.",
        detail: "Derived by subtracting current solar power yield from an equivalent fossil-grid generation benchmark index."
      },
      {
        title: "Peak Solar Yield",
        desc: "The absolute highest active collection rate achieved by the collector field during the day, recorded in kilowatts or megawatt-hours.",
        detail: "Typically achieved around 12:00 to 13:00 (zenith hours) when the sun is aligned orthogonal to the collector panels."
      },
      {
        title: "Active Nodes & Connected Hardware",
        desc: "Count of panels and grid collectors returning regular pings. A high count ensures grid balancing is highly distributed.",
        detail: "If panel nodes go offline (due to localized dust or failure), load balancing distributes energy requirements across remaining cells."
      },
      {
        title: "Hadoop Cluster Memory & CPU Usage",
        desc: "Telemetry computations require heavy computing horsepower. Tracks active virtual core allocation and RAM heap saturation.",
        detail: "Kept below 85% to ensure safety margins are preserved during massive MapReduce query intervals."
      },
      {
        title: "Telemetry Heartbeat Signal",
        desc: "A periodic, sub-second telemetry pulse transmitted by grid components to confirm connection status with the NameNode.",
        detail: "If a heartbeat of any cell fails for more than 10 seconds, the security dashboard issues an Amber alert."
      }
    ],
    didYouKnow: "Carbon Saved calculations are updated every 5 seconds to provide visual positive reinforcement of our active environmental progress.",
    keywords: ["grid load", "carbon saved", "peak yield", "active node", "resource usage", "metrics", "kpi", "heartbeats", "forecast accuracy"]
  },
  {
    id: "warnings",
    title: "5. Warning Systems & Safety Thresholds",
    category: "Safety Protocols",
    desc: "A critical skill for operators is interpreting alarms correctly. SK Power Core utilizes color-coded levels and alert queues to communicate grid risks immediately.",
    bullets: [
      {
        title: "Red Alarms (Critical Errors)",
        desc: "Denotes catastrophic occurrences requiring instant manual mitigation. Systems may automatically trigger circuit bypasses.",
        detail: "Examples include 'Inverter Failure - Bypass Active' or extreme thermal overheating. Immediate inspection is critical."
      },
      {
        title: "Amber Warnings (Elevated Caution)",
        desc: "Indicates non-catastrophic abnormalities that risk becoming critical if ignored.",
        detail: "Examples include 'Impedance Drift in Cluster B' or debris warnings. Often fixed by scheduling cleaning rosters."
      },
      {
        title: "High Storage & Memory Bloat Alerts",
        desc: "Triggers when HDFS file allocations are approaching 90% space saturation.",
        detail: "Requires compression cycles, log archiving, or physical storage expansion to prevent write failure."
      },
      {
        title: "Intrusion Containment Alerts",
        desc: "Triggers when firewall log filters detect illegal network requests trying to query operational ports.",
        detail: "Automatically isolates affected collector subnets to protect physical electrical routers from remote tampering."
      },
      {
        title: "System Overloads & Thermal Safety Locks",
        desc: "Photovoltaic cells degrade quickly when ambient cell heat exceeds 45°C. System flags warn you to throttle outputs.",
        detail: "You can turn on the Thermal Safety auto-throttle under Settings to let the system self-protect automatically."
      }
    ],
    didYouKnow: "You can use the 'Alert Generation Console' inside the Security tab to inject warnings and errors, which is excellent for simulator train-ups.",
    keywords: ["alerts", "warnings", "red alerts", "amber alerts", "safety", "unauthorized access", "overload", "thermal lock"]
  }
];

const FAQS = [
  {
    q: "How does the date adjuster in the Reports tab work?",
    a: "The Reports date adjuster lets you travel to past dates (or set custom daily operations days). Adjusting the date recalculates the operating metrics, hourly schedules, averages, and allows downloading fully customized JSON or CSV files matching that selected epoch."
  },
  {
    q: "Why was the 'Value Savings Yield' metric removed from monthly rollups?",
    a: "Per clean-energy grid administrative updates, economic financial yields are regulated separately under corporate tax auditing. To focus purely on energy logistics, the panel metrics have been refactored to prioritize environmental metrics, total generation data, and clean Carbon Mitigations (saved CO2 tons)."
  },
  {
    q: "What are the standard troubleshooting steps if a solar panel is marked 'Faulty'?",
    a: "1. Browse to Asset Tracking. 2. Filter for Faulty units to find the specific ID. 3. Check the localized error: if it is 'Needs Cleaning', schedule a panel cleaning. If 'Cell Failure' or 'Low Energy', designate on-site field engineers listed on the panel roster."
  },
  {
    q: "What happens when I trigger the 'Manual SafeMode Override' in the Hadoop panel?",
    a: "Toggling SafeMode override immediately forces the filesystem to become readable and writable. Under normal startup, NameNode stays in SafeMode to avoid data writes while performing replication tests. Forcing this state is helpful in emergency operator scenarios."
  },
  {
    q: "Is the AI Assistant chatbot fully connected to live grid metrics?",
    a: "Yes, our integrated operator assistant parses your queries and analyzes live simulated states (including active panel statuses, currently selected date, and warning logs) to provide direct telemetry answers."
  }
];

// --- Components ---

const Gauge = ({ label, value, unit, color, status }: { label: string, value: number, unit: string, color: string, status: string }) => {
  const percentage = unit === '%' 
    ? value 
    : unit.toLowerCase() === 'kw' 
      ? (value / 10) * 100 
      : (value / 120) * 100;

  return (
    <div className="glass-card p-6 flex flex-col items-center text-center">
      <div className="relative w-32 h-32 mb-4">
        {/* Background track */}
        <svg className="w-full h-full -rotate-90">
          <circle 
            cx="64" cy="64" r="54" 
            fill="transparent" 
            stroke="var(--border-color)" 
            strokeWidth="10" 
            strokeDasharray="339.29" 
            strokeDashoffset="101.78"
            strokeLinecap="round"
          />
          <motion.circle 
            initial={{ strokeDashoffset: 339.29 }}
            animate={{ strokeDashoffset: 339.29 - (339.29 - 101.78) * (percentage / 100) }}
            cx="64" cy="64" r="54" 
            fill="transparent" 
            stroke={color} 
            strokeWidth="10" 
            strokeDasharray="339.29" 
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          <span className="text-xl font-bold font-display text-[var(--text-primary)] leading-none">{value}</span>
          <span className="text-[10px] text-[var(--text-muted)] font-black uppercase mt-0.5">{unit}</span>
        </div>
      </div>
      <h3 className="text-sm font-bold text-[var(--text-secondary)]">{label}</h3>
      <p className="text-xs text-[var(--text-primary)] font-mono mt-1 font-semibold">{status}</p>
    </div>
  );
};

const ProgressBarRow = ({ label, value, unit, percentage, color }: { label: string, value: string, unit: string, percentage: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-[var(--text-secondary)]">{label} - {percentage}%</span>
      <span className="text-[var(--text-primary)]">{value} {unit}</span>
    </div>
    <div className="w-full h-2 bg-[var(--border-color)]/30 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className={cn("h-full", color)}
      />
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, expanded = true }: { icon: any, label: string, active?: boolean, onClick?: () => void, expanded?: boolean }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center px-3.5 py-3 rounded-xl transition-all duration-300 group text-sm font-medium relative justify-start",
      active 
        ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" 
        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)]/60"
    )}
    title={!expanded ? label : undefined}
  >
    <div className="flex items-center justify-center shrink-0 w-5 h-5">
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active && "text-brand-cyan")} />
    </div>
    
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.span 
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15 }}
          className="ml-3 font-medium text-left whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>

    {active && expanded && (
      <motion.div 
        layoutId="active-pill" 
        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-cyan glow-cyan shrink-0" 
      />
    )}
  </button>
);

const MetricCard = ({ title, value, unit, trend, icon: Icon, color }: { title: string, value: string, unit: string, trend: string, icon: any, color: string }) => {
  const isCyan = color.includes('cyan') || color.includes('sky') || color.includes('brand-cyan');
  const isEmer = color.includes('emerald') || color.includes('green');
  const isAmber = color.includes('amber') || color.includes('orange') || color.includes('brand-amber');
  const isRose = color.includes('rose') || color.includes('red');

  const glowClass = isCyan 
    ? "shadow-[0_0_25px_-5px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] hover:border-cyan-500/40" 
    : isEmer 
    ? "shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)] hover:shadow-[0_0_35px_rgba(16,185,129,0.3)] hover:border-emerald-500/40" 
    : isAmber 
    ? "shadow-[0_0_25px_-5px_rgba(245,158,11,0.15)] hover:shadow-[0_0_35px_rgba(245,158,11,0.3)] hover:border-amber-500/40" 
    : isRose 
    ? "shadow-[0_0_25px_-5px_rgba(244,63,94,0.15)] hover:shadow-[0_0_35px_rgba(244,63,94,0.3)] hover:border-rose-500/40"
    : "shadow-2xl shadow-black/[0.08]";

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("glass-card glass-card-hover p-6 flex flex-col gap-4 relative overflow-hidden", glowClass)}
    >
      {/* Dynamic ambient background glow capsule */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[35px] opacity-[0.16] pointer-events-none transition-all duration-550 group-hover:scale-125",
        isCyan ? "bg-cyan-400" : isEmer ? "bg-emerald-400" : isAmber ? "bg-amber-400" : "bg-rose-400"
      )} />

      <div className="flex justify-between items-start relative z-10">
        <div className={cn("p-3 rounded-2xl shadow-inner", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={cn(
          "text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm",
          trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
        )}>
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <h3 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider">{title}</h3>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-3xl font-display font-black text-[var(--text-primary)] tracking-tight">{value}</span>
          <span className="text-xs text-[var(--text-muted)] font-mono font-bold uppercase">{unit}</span>
        </div>
      </div>
      <div className="w-full bg-[var(--border-color)]/20 h-1.5 rounded-full overflow-hidden relative z-10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </motion.div>
  );
};

// --- Predictable Data Generators ---
const getDeterministicDataForDate = (dateStr: string) => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);
  const data = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const diurnal = hour > 6 && hour < 18 ? Math.sin((hour - 6) * Math.PI / 12) : 0;
    const baseGen = 480 * diurnal * (0.85 + (seed % 30) / 100);
    const noise = Math.abs(Math.sin(seed + hour) * 35);
    const finalGen = Math.max(0, baseGen + (diurnal > 0 ? noise : 0));
    const forecastGen = Math.max(0, baseGen * 0.98 + Math.cos(seed * hour) * 15);
    const temp = 16 + (diurnal * 14) + (seed % 10) * 0.4 + Math.sin(hour) * 1.5;
    const baseConsumption = 180 + (seed % 15) * 8;
    const peakEffect = (hour > 17 && hour < 22) ? 120 : ((hour > 7 && hour < 10) ? 90 : 20);
    const finalConsumption = baseConsumption + peakEffect + Math.sin(hour * 2) * 15;
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      generation: Number(finalGen.toFixed(1)),
      forecast: Number(forecastGen.toFixed(1)),
      temp: Number(temp.toFixed(1)),
      consumption: Number(finalConsumption.toFixed(1))
    });
  }
  return data;
};

const getDeterministicForecast = (irradiance: number, temp: number, cloudCover: number, dust: number) => {
  const baseFactors = [120, 140, 110, 160, 150, 130, 145];
  return baseFactors.map((base, idx) => {
    const cloudMultiplier = (100 - cloudCover) / 100;
    const dustMultiplier = (100 - dust) / 100;
    const irradianceMultiplier = irradiance / 180;
    const tempEffect = 1 - Math.abs(temp - 25) * 0.01;
    const finalVal = base * irradianceMultiplier * cloudMultiplier * dustMultiplier * tempEffect;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return {
      day: days[idx].substring(0, 3),
      fullName: days[idx],
      val: Number(Math.max(10, finalVal).toFixed(1)),
      weather: cloudCover > 40 ? 'Overcast' : (cloudCover > 15 ? 'Partly Cloudy' : 'Sunny'),
      efficiency: Number((85 * cloudMultiplier * tempEffect).toFixed(1))
    };
  });
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState('2026-05-23');
  const [data, setData] = useState<GenerationPoint[]>(() => getDeterministicDataForDate('2026-05-23'));
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'cyberpunk' | 'sunset' | 'ocean' | 'forest'>('dark');

  // --- Ambient SunCore Dashboard Background Customization States ---
  const [dashboardBg, setDashboardBg] = useState<string>('turbines');
  const [customBgUrl, setCustomBgUrl] = useState('');
  const [bgOpacity, setBgOpacity] = useState<number>(100); // 100% opacity for maximum high-contrast color depth and crispness
  const [bgBlur, setBgBlur] = useState<'none' | 'sm' | 'md' | 'lg'>('none'); // Start sharp and crisp like the reference image
  const [backdropActive, setBackdropActive] = useState(true);

  const activeBgUrl = useMemo(() => {
    if (dashboardBg === 'none') return '';
    if (dashboardBg === 'custom') {
      return customBgUrl || 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1200&auto=format&fit=crop';
    }
    const found = DASHBOARD_BACKGROUNDS.find(b => b.id === dashboardBg);
    return found ? found.url : '';
  }, [dashboardBg, customBgUrl]);

  // --- Alert System Working State ---
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [alertFormMessage, setAlertFormMessage] = useState('');
  const [alertFormType, setAlertFormType] = useState<Alert['type']>('warning');

  // --- Forecasting Controls State ---
  const [forecastIrradiance, setForecastIrradiance] = useState(180);
  const [forecastTemp, setForecastTemp] = useState(30);
  const [forecastCloudCover, setForecastCloudCover] = useState(15);
  const [forecastDust, setForecastDust] = useState(10);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [adjustedForecast, setAdjustedForecast] = useState(() => getDeterministicForecast(180, 30, 15, 10));

  // --- Interactive Report Analyzer Period ---
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'health'>('daily');

  // --- Detailed Panel Diagnostics States ---
  const [selectedDiagPanelId, setSelectedDiagPanelId] = useState<string>('1');
  const [diagFilter, setDiagFilter] = useState<'All' | 'Active' | 'Charging' | 'Maintenance' | 'Faulty'>('All');
  const [diagSearch, setDiagSearch] = useState('');
  const [diagLogs, setDiagLogs] = useState(() => [
    { id: 'log-1', timestamp: '2026-05-24 05:40', panelId: '5', panelName: 'LO-3x4', type: 'Calibration', status: 'Completed', detail: 'Voltage phase alignment optimized via remote smart grid commands.' },
    { id: 'log-2', timestamp: '2026-05-24 03:15', panelId: '12', panelName: 'AH-7x8', type: 'Fault Overridden', status: 'Active', detail: 'Low irradiance warning bypassed temporarily for sub-system testing.' },
    { id: 'log-3', timestamp: '2026-05-23 21:00', panelId: '22', panelName: 'XK-2x9', type: 'Thermal Recalibration', status: 'Completed', detail: 'Cooling fluid dispenser cycle executed. Crystalline core temperature decreased by 6.4°C.' },
    { id: 'log-4', timestamp: '2026-05-23 18:30', panelId: '45', panelName: 'HT-5x6', type: 'Cleaning Crew', status: 'Dispatched', detail: 'High debris accumulation reported. Maintenance representative dispatched with ticket #441.' },
    { id: 'log-5', timestamp: '2026-05-23 12:45', panelId: '8', panelName: 'DE-9x1', type: 'Grid Synced', status: 'Completed', detail: 'Re-synchronized micro-inverter safely with high voltage substation regional grid.' }
  ]);
  const [dispatcherMessage, setDispatcherMessage] = useState<string | null>(null);

  // --- Help & Documentation / User Guide States ---
  const [settingsSection, setSettingsSection] = useState<'general' | 'guide'>('general');
  const [docSearch, setDocSearch] = useState('');
  const [activeManualSection, setActiveManualSection] = useState<string>('intro');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Interactive Walkthrough state
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [userOnboardingProgress, setUserOnboardingProgress] = useState<string[]>(['read_intro']);
  const [chatbotQuery, setChatbotQuery] = useState('');
  const [chatbotMessages, setChatbotMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([
    { sender: 'ai', text: 'Hello operator! I am your SK Power Core operating virtual chatbot assistant. Ask me anything about Hadoop analytics, HDFS clusters, solar panels status, forecasting formulas, or peak load metrics!' }
  ]);
  const [smartTipIndex, setSmartTipIndex] = useState(0);

  const handleDownloadManual = () => {
    let docContent = "SK POWER CORE - INDUSTRIAL USER MANUAL & OPERATOR PLAYBOOK\n";
    docContent += "=========================================================\n\n";
    MANUAL_SECTIONS.forEach(sec => {
      docContent += `\n${sec.title.toUpperCase()}\n`;
      docContent += `${"-".repeat(sec.title.length)}\n`;
      docContent += `${sec.desc}\n\n`;
      sec.bullets.forEach(b => {
        docContent += `* ${b.title}: ${b.desc}\n`;
        if (b.detail) docContent += `  Detail: ${b.detail}\n`;
      });
      docContent += "\n";
    });
    
    docContent += "\n============================================\n";
    docContent += "FREQUENTLY ASKED QUESTIONS (FAQ)\n";
    docContent += "============================================\n";
    FAQS.forEach((faq, idx) => {
      docContent += `\nQ${idx+1}: ${faq.q}\n`;
      docContent += `A: ${faq.a}\n`;
    });
    
    const blob = new Blob([docContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SK_Power_Core_User_Manual.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatbotQuery.trim()) return;
    
    const userMsg = chatbotQuery.trim();
    const newMessages = [...chatbotMessages, { sender: 'user' as const, text: userMsg }];
    setChatbotMessages(newMessages);
    setChatbotQuery('');
    
    // Increment progress for using chatbot
    if (!userOnboardingProgress.includes('chatbot_consult')) {
      setUserOnboardingProgress([...userOnboardingProgress, 'chatbot_consult']);
    }
    
    setTimeout(() => {
      const q = userMsg.toLowerCase();
      let reply = "I've processed your telemetry query command. ";
      
      if (q.includes('hadoop') || q.includes('hdfs') || q.includes('yarn') || q.includes('namenode') || q.includes('datanode')) {
        reply += "Our Hadoop engine virtualizes an HDFS environment across three local nodes (datanode-01, -02, -03). Files are sliced into 128MB payload blocks replicated 3 times to withstand multi-node downtime. SafeMode keeps NameNode logs read-only during initial replication audits.";
      } else if (q.includes('solar') || q.includes('panel') || q.includes('clean') || q.includes('dirty') || q.includes('temperature') || q.includes('faulty')) {
        reply += "Solar asset metrics track irradiance levels (W/m²), battery charge thresholds (%), and operations. If cell temperatures cross 45°C, thermal safety lockdowns can auto-throttle panels. Panels with low output are flagged as 'Needs Cleaning' and on-site engineers should be dispatched from their specific panel roster.";
      } else if (q.includes('alert') || q.includes('error') || q.includes('warning') || q.includes('danger')) {
        reply += "Our safety protocols utilize red and amber light lines. Red alerts signify hard inverter failure or network blockages. Amber alerts indicate drift thresholds. You can simulate alert injections using the live Generator block in the Security workspace.";
      } else if (q.includes('date') || q.includes('report') || q.includes('csv') || q.includes('json') || q.includes('download')) {
        reply += "Operative and generation statements can be adjusted to past epochs in the Reports view. Adjusting the target date automatically recalculates the hourly load logs, mean outputs, and active alert counts for compiling compliant CSV or JSON spreadsheets.";
      } else if (q.includes('economic') || q.includes('value') || q.includes('savings') || q.includes('yield') || q.includes('dollar') || q.includes('money')) {
        reply += "Per administrative directives, financial economics metrics ('Value Savings Yield') have been removed from the monthly logs to prioritize clean-energy carbon offset mitigations (saved CO2 volume in tons) and direct operational yields.";
      } else if (q.includes('tour') || q.includes('onboarding') || q.includes('walkthrough')) {
        reply += "You can initiate the automated operator training session in Chapter 6 ('Guided Walkthrough') of this Settings manual to practice calibrations interactively.";
      } else {
        reply += "As an SK Power Core operator, you can schedule MapReduce cluster jobs, inspect asset diagnostic tables, and configure thermal safety locks to protect active arrays. Let me know if you need specific instructions on any of these systems!";
      }
      
      setChatbotMessages(prev => [...prev, { sender: 'ai' as const, text: reply }]);
    }, 850);
  };


  // --- Hadoop Simulated Big Data State ---
  const [hadoopStatus, setHadoopStatus] = useState<any>(null);
  const [hdfsPath, setHdfsPath] = useState<string>("/");
  const [hdfsFiles, setHdfsFiles] = useState<any[]>([]);
  const [hdfsLoading, setHdfsLoading] = useState<boolean>(false);
  const [selectedHdfsFile, setSelectedHdfsFile] = useState<any>(null);
  const [mrJobs, setMrJobs] = useState<any[]>([]);
  const [mrSubmitting, setMrSubmitting] = useState<boolean>(false);
  const [mrTab, setMrTab] = useState<'cluster' | 'mapreduce' | 'hdfs'>('cluster');
  const [mrRecordsLimit, setMrRecordsLimit] = useState<number>(5000);

  const loadHadoopStatus = async () => {
    try {
      const res = await fetch('/api/hadoop/status');
      const d = await res.json();
      setHadoopStatus(d);
    } catch (e) {
      console.error(e);
    }
  };

  const loadHdfsFiles = async (pathStr: string) => {
    setHdfsLoading(true);
    try {
      const res = await fetch(`/api/hadoop/webhdfs/list?path=${encodeURIComponent(pathStr)}`);
      const d = await res.json();
      if (d && d.FileStatuses && d.FileStatuses.FileStatus) {
        setHdfsFiles(d.FileStatuses.FileStatus);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHdfsLoading(false);
    }
  };

  const loadMrJobs = async () => {
    try {
      const res = await fetch('/api/hadoop/mapreduce/jobs');
      const d = await res.json();
      setMrJobs(d);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReadHdfsFile = async (nameSuffix: string) => {
    const fullPath = hdfsPath === '/' ? `/${nameSuffix}` : `${hdfsPath}/${nameSuffix}`;
    try {
      const res = await fetch(`/api/hadoop/webhdfs/read?path=${encodeURIComponent(fullPath)}`);
      const d = await res.json();
      setSelectedHdfsFile(d);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunMapReduce = async () => {
    setMrSubmitting(true);
    try {
      const res = await fetch('/api/hadoop/mapreduce/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "SolarPower_PeakOptimizer_PC",
          inputPath: "/user/shaikh/solar_data/pimpri_chinchwad_raw.json",
          recordsLimit: mrRecordsLimit
        })
      });
      const d = await res.json();
      if (d.success) {
        // Poll for completion
        const interval = setInterval(async () => {
          const checkRes = await fetch('/api/hadoop/mapreduce/jobs');
          const checkData = await checkRes.json();
          setMrJobs(checkData);
          
          const runningJob = checkData.find((j: any) => j.id === d.jobId);
          if (runningJob && (runningJob.status === 'COMPLETED' || runningJob.status === 'FAILED')) {
            clearInterval(interval);
            setMrSubmitting(false);
            // Reload files in case we are in output folder
            loadHdfsFiles(hdfsPath);
          }
        }, 1200);
      } else {
        setMrSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      setMrSubmitting(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Big Data Hub') {
      loadHadoopStatus();
      loadHdfsFiles(hdfsPath);
      loadMrJobs();
    }
  }, [activeTab, hdfsPath]);

  useEffect(() => {
    setData(getDeterministicDataForDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    // Sync theme with document element
    const allThemes = ['light', 'dark', 'cyberpunk', 'sunset', 'ocean', 'forest'];
    allThemes.forEach(t => {
      document.documentElement.classList.remove(t);
    });
    document.documentElement.classList.add(theme);
    
    // Maintain backward-compatibility mapping for components using standard 'dark:' specifiers
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const dataTimer = setInterval(() => {
      if (selectedDate !== '2026-05-23') {
        return; // No realtime drift on historical data lookups
      }
      setData(prev => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        if (!last) return prev;
        const nextHour = (parseInt(last.time.split(':')[0]) + 1) % 24;
        const baseGen = nextHour > 6 && nextHour < 18 ? Math.sin((nextHour - 6) * Math.PI / 12) * 500 : 0;
        const noise = Math.random() * 20;
        
        newData.push({
          time: `${nextHour.toString().padStart(2, '0')}:00`,
          generation: Math.max(0, baseGen + noise),
          forecast: Math.max(0, baseGen * 0.95 + Math.random() * 30),
          temp: 20 + Math.sin((nextHour - 4) * Math.PI / 12) * 10 + Math.random() * 2,
          consumption: 180 + Math.sin(nextHour * 2) * 15 + ((nextHour > 17 && nextHour < 22) ? 120 : 20)
        });
        
        return newData.slice(-24);
      });
    }, 5000);
    return () => {
      clearInterval(timer);
      clearInterval(dataTimer);
    };
  }, [selectedDate]);

  const stats = useMemo(() => {
    const current = data[data.length - 1]?.generation || 0;
    const avg = data.reduce((acc, curr) => acc + curr.generation, 0) / (data.length || 1);
    return {
      current: current.toFixed(1),
      dailyTotal: (avg * 24).toFixed(0),
      peak: Math.max(...data.map(d => d.generation), 0).toFixed(1),
      efficiency: (84.5 + Math.random() * 2).toFixed(1)
    };
  }, [data]);

  const handleDownloadReport = (type: 'daily' | 'weekly' | 'monthly' | 'health', format: 'csv' | 'json' | 'pdf') => {
    let filename = '';
    let content = '';
    let mimeType = '';

    if (format === 'pdf') {
      filename = `solar-grid-${type}-report_${selectedDate}.pdf`;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Headers (Slate top bar with Cyan accent line)
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 42, 'F');

      doc.setFillColor(6, 182, 212); // brand-cyan
      doc.rect(0, 42, 210, 1.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SK POWER CORE • OPERATIVE REPORT", 14, 18);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(165, 180, 252);
      doc.text("REGIONAL GRID CONTROL CENTER • PINPRI CHINCHWAD, MAHARASHTRA", 14, 25);
      doc.setTextColor(148, 163, 184);
      doc.text(`DATE OF AUDIT: ${selectedDate} | SYSTEM TIME: ${new Date().toLocaleTimeString()}`, 14, 32);

      let y = 55;

      if (type === 'daily') {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text("DAILY SOLAR GRID OPERATING STATEMENT", 14, y);
        y += 8;

        // Draw KPI block
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y, 182, 20, 2, 2, 'FD');

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("TOTAL YIELD", 20, y + 6);
        doc.text("PEAK LOAD", 80, y + 6);
        doc.text("GRID STABILITY", 140, y + 6);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(6, 182, 212);
        doc.text((data.reduce((acc, curr) => acc + curr.generation, 0)).toFixed(1) + " kWh", 20, y + 14);
        doc.text(Math.max(...data.map(d => d.generation), 0).toFixed(1) + " kW", 80, y + 14);
        doc.text("98.2%", 140, y + 14);

        y += 30;

        // Table Header
        doc.setFillColor(15, 23, 42);
        doc.rect(14, y, 182, 8, 'F');
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text("Hour", 18, y + 5.5);
        doc.text("Generation (kW)", 50, y + 5.5);
        doc.text("Forecast (kW)", 90, y + 5.5);
        doc.text("Temp (°C)", 130, y + 5.5);
        doc.text("Consumption", 165, y + 5.5);
        
        y += 8;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);

        data.forEach((d, idx) => {
          if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y, 182, 7, 'F');
          }
          doc.text(d.time, 18, y + 5);
          doc.text(d.generation.toString(), 50, y + 5);
          doc.text((d.forecast || '-').toString(), 90, y + 5);
          doc.text((d.temp || '-').toString(), 130, y + 5);
          doc.text((d.consumption || '-').toString() + " kW", 165, y + 5);
          y += 7;
          
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });
      } else if (type === 'weekly') {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text("WEEKLY SOLAR OPERATING STATEMENT", 14, y);
        y += 8;

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y, 182, 20, 2, 2, 'FD');

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("ANALYSIS INTERVAL", 20, y + 6);
        doc.text("AVG COLLECTOR POWER", 75, y + 6);
        doc.text("CARBON AVOIDED", 135, y + 6);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(16, 185, 129);
        doc.text("7 Scheduled Days", 20, y + 14);
        doc.text("955.7 kWh", 75, y + 14);
        doc.text("4.07 Metric Tons", 135, y + 14);

        y += 30;

        doc.setFillColor(15, 23, 42);
        doc.rect(14, y, 182, 8, 'F');
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text("Operating Day", 18, y + 5.5);
        doc.text("Total Yield (kWh)", 50, y + 5.5);
        doc.text("Peak Capacity (kW)", 90, y + 5.5);
        doc.text("Avg Efficiency", 125, y + 5.5);
        doc.text("Cloud Density", 155, y + 5.5);
        doc.text("Carbon Saved", 182, y + 5.5);

        y += 8;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);

        const weeklyData = [
          { day: 'Monday', yieldKWh: 840, peakKW: 120, efficiency: '84.2%', cloudCover: '10%', carbonSavedKg: 520 },
          { day: 'Tuesday', yieldKWh: 980, peakKW: 140, efficiency: '85.6%', cloudCover: '15%', carbonSavedKg: 610 },
          { day: 'Wednesday', yieldKWh: 770, peakKW: 110, efficiency: '81.9%', cloudCover: '35%', carbonSavedKg: 480 },
          { day: 'Thursday', yieldKWh: 1120, peakKW: 160, efficiency: '88.1%', cloudCover: '8%', carbonSavedKg: 700 },
          { day: 'Friday', yieldKWh: 1050, peakKW: 150, efficiency: '87.4%', cloudCover: '12%', carbonSavedKg: 650 },
          { day: 'Saturday', yieldKWh: 910, peakKW: 130, efficiency: '83.5%', cloudCover: '20%', carbonSavedKg: 560 },
          { day: 'Sunday', yieldKWh: 1010, peakKW: 145, efficiency: '86.2%', cloudCover: '14%', carbonSavedKg: 630 }
        ];

        weeklyData.forEach((w, idx) => {
          if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y, 182, 8, 'F');
          }
          doc.text(w.day, 18, y + 5.5);
          doc.text(w.yieldKWh + " kWh", 50, y + 5.5);
          doc.text(w.peakKW + " kW", 90, y + 5.5);
          doc.text(w.efficiency, 125, y + 5.5);
          doc.text(w.cloudCover, 155, y + 5.5);
          doc.text(w.carbonSavedKg + " Kg", 182, y + 5.5);
          y += 8;
        });
      } else if (type === 'monthly') {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text("MONTHLY REGIONAL RESOURCE STATEMENTS", 14, y);
        y += 8;

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y, 182, 20, 2, 2, 'FD');

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("AUDIT SCOPE", 20, y + 6);
        doc.text("TOTAL GENERATION", 75, y + 6);
        doc.text("CARBON MITIGATIONS", 135, y + 6);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(245, 158, 11);
        doc.text("Rolling H1 Rollups", 20, y + 14);
        doc.text("137.9 MWh", 75, y + 14);
        doc.text("85.5 Metric Tons", 135, y + 14);

        y += 30;

        doc.setFillColor(15, 23, 42);
        doc.rect(14, y, 182, 8, 'F');
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text("Billing Cycle", 18, y + 5.5);
        doc.text("Yield (MWh)", 50, y + 5.5);
        doc.text("Industrial Sink", 85, y + 5.5);
        doc.text("Node Efficiency", 125, y + 5.5);
        doc.text("Carbon Offset", 155, y + 5.5);
        doc.text("Incidents", 182, y + 5.5);

        y += 8;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);

        const monthlyData = [
          { month: 'January', yieldMWh: 24.8, consumptionMWh: 18.2, efficiencyIndex: '84.2%', carbonOffsetTons: 15.4, alarms: 2 },
          { month: 'February', yieldMWh: 28.1, consumptionMWh: 19.5, efficiencyIndex: '85.6%', carbonOffsetTons: 17.4, alarms: 1 },
          { month: 'March', yieldMWh: 32.4, consumptionMWh: 22.0, efficiencyIndex: '81.9%', carbonOffsetTons: 20.1, alarms: 4 },
          { month: 'April', yieldMWh: 30.2, consumptionMWh: 21.4, efficiencyIndex: '88.1%', carbonOffsetTons: 18.7, alarms: 3 },
          { month: 'May (MTD)', yieldMWh: 22.4, consumptionMWh: 14.8, efficiencyIndex: '87.4%', carbonOffsetTons: 13.9, alarms: 0 }
        ];

        monthlyData.forEach((m, idx) => {
          if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y, 182, 8, 'F');
          }
          doc.text(m.month, 18, y + 5.5);
          doc.text(m.yieldMWh + " MWh", 50, y + 5.5);
          doc.text(m.consumptionMWh + " MWh", 85, y + 5.5);
          doc.text(m.efficiencyIndex, 125, y + 5.5);
          doc.text(m.carbonOffsetTons + " Tons", 155, y + 5.5);
          doc.text(`${m.alarms} Faults`, 182, y + 5.5);
          y += 8;
        });
      } else if (type === 'health') {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text("SOLAR ASSET HEALTH DIAGNOSTIC AUDIT", 14, y);
        y += 8;

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y, 182, 20, 2, 2, 'FD');

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("TOTAL SCAN COUNT", 20, y + 6);
        doc.text("OPTIMAL STATUS", 75, y + 6);
        doc.text("DEGRADATION FLAGS", 135, y + 6);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(6, 182, 212);
        doc.text(`${PANELS.length} Panels`, 20, y + 14);
        doc.text(`${PANELS.filter(p => p.healthIssue === 'None').length}% Safe`, 75, y + 14);
        doc.text(`${PANELS.filter(p => p.healthIssue !== 'None').length} Faulty Units`, 135, y + 14);

        y += 30;

        doc.setFillColor(15, 23, 42);
        doc.rect(14, y, 182, 8, 'F');
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text("Panel Name", 18, y + 5.5);
        doc.text("Status", 45, y + 5.5);
        doc.text("Irradiance (W/m²)", 75, y + 5.5);
        doc.text("Current Charge", 110, y + 5.5);
        doc.text("Temperature", 145, y + 5.5);
        doc.text("Diagnostics", 175, y + 5.5);

        y += 8;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);

        PANELS.slice(0, 25).forEach((p, idx) => {
          if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y, 182, 8, 'F');
          }
          doc.text(`${p.name} (#${p.id})`, 18, y + 5.5);
          doc.text(p.status, 45, y + 5.5);
          doc.text(p.irradiance.toString(), 75, y + 5.5);
          doc.text(p.energy, 110, y + 5.5);
          doc.text(p.temperature + "°C", 145, y + 5.5);
          doc.text(p.healthIssue || 'None', 175, y + 5.5);
          y += 8;
        });
      }

      // Footer
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("SK POWER CORE SYSTEMS • CONFIDENTIAL GRID METRICS OPERATING REPORT", 14, 287);
      doc.text("AUTO-GENERATED VIA CLOUD INTEGRITY GATEWAY", 145, 287);

      doc.save(filename);
      return;
    }

    if (type === 'daily') {
      filename = `solar-grid-daily-report_${selectedDate}.${format}`;
      if (format === 'json') {
        const payload = {
          reportType: 'Daily Solar Grid Operating Report',
          region: 'Pimpri Chinchwad, Maharashtra, India',
          generatedDate: selectedDate,
          totalYieldKWh: (data.reduce((acc, curr) => acc + curr.generation, 0)).toFixed(1),
          peakLoadKW: Math.max(...data.map(d => d.generation), 0).toFixed(1),
          gridStabilityPct: '98.2%',
          hourlyAverages: data
        };
        content = JSON.stringify(payload, null, 2);
        mimeType = 'application/json';
      } else {
        const headers = 'Hour,Generation_kW,Forecast_kW,AmbientTemp_C,Consumption_kW,Grid_Status\n';
        const rows = data.map(d => `${d.time},${d.generation},${d.forecast || '-'},${d.temp || '-'},${d.consumption || '-'},Optimal`).join('\n');
        content = headers + rows;
        mimeType = 'text/csv';
      }
    } else if (type === 'weekly') {
      filename = `solar-grid-weekly-report_${selectedDate}.${format}`;
      const weeklyData = [
        { day: 'Monday', yieldKWh: 840, peakKW: 120, efficiency: '84.2%', cloudCover: '10%', carbonSavedKg: 520 },
        { day: 'Tuesday', yieldKWh: 980, peakKW: 140, efficiency: '85.6%', cloudCover: '15%', carbonSavedKg: 610 },
        { day: 'Wednesday', yieldKWh: 770, peakKW: 110, efficiency: '81.9%', cloudCover: '35%', carbonSavedKg: 480 },
        { day: 'Thursday', yieldKWh: 1120, peakKW: 160, efficiency: '88.1%', cloudCover: '8%', carbonSavedKg: 700 },
        { day: 'Friday', yieldKWh: 1050, peakKW: 150, efficiency: '87.4%', cloudCover: '12%', carbonSavedKg: 650 },
        { day: 'Saturday', yieldKWh: 910, peakKW: 130, efficiency: '83.5%', cloudCover: '20%', carbonSavedKg: 560 },
        { day: 'Sunday', yieldKWh: 1010, peakKW: 145, efficiency: '86.2%', cloudCover: '14%', carbonSavedKg: 630 }
      ];
      if (format === 'json') {
        content = JSON.stringify({
          reportType: 'Weekly Solar Grid Operating Report',
          weekEndDate: selectedDate,
          weeklyAggregates: weeklyData
        }, null, 2);
        mimeType = 'application/json';
      } else {
        const headers = 'Day,Total_Yield_kWh,Peak_Generation_kW,Efficiency_Pct,Cloud_Cover_Pct,Carbon_Saved_kg\n';
        const rows = weeklyData.map(w => `${w.day},${w.yieldKWh},${w.peakKW},${w.efficiency},${w.cloudCover},${w.carbonSavedKg}`).join('\n');
        content = headers + rows;
        mimeType = 'text/csv';
      }
    } else if (type === 'health') {
      filename = `solar-panel-health-report_${selectedDate}.${format}`;
      if (format === 'json') {
        const payload = {
          reportType: 'Solar Grid Panel Health Audit',
          region: 'Pimpri Chinchwad, Maharashtra, India',
          generatedDate: selectedDate,
          totalPanelsAnalyzed: PANELS.length,
          activeCount: PANELS.filter(p => p.status === 'Active').length,
          faultyCount: PANELS.filter(p => p.status === 'Faulty').length,
          maintenanceCount: PANELS.filter(p => p.status === 'Maintenance').length,
          panelDiagnostics: PANELS
        };
        content = JSON.stringify(payload, null, 2);
        mimeType = 'application/json';
      } else {
        const headers = 'Panel_ID,Status,Irradiance_W_m2,Energy_Output,Battery_Level_Pct,Temperature_C,Health_Issue\n';
        const rows = PANELS.map(p => `${p.id},${p.status},${p.irradiance},${p.energy},${p.battery},${p.temperature},${p.healthIssue || 'None'}`).join('\n');
        content = headers + rows;
        mimeType = 'text/csv';
      }
    } else {
      filename = `solar-grid-monthly-report_${selectedDate}.${format}`;
      const monthlyData = [
        { month: 'January', yieldMWh: 24.8, consumptionMWh: 18.2, carbonOffsetTons: 15.4, alarms: 2 },
        { month: 'February', yieldMWh: 28.1, consumptionMWh: 19.5, carbonOffsetTons: 17.4, alarms: 1 },
        { month: 'March', yieldMWh: 32.4, consumptionMWh: 22.0, carbonOffsetTons: 20.1, alarms: 4 },
        { month: 'April', yieldMWh: 30.2, consumptionMWh: 21.4, carbonOffsetTons: 18.7, alarms: 3 },
        { month: 'May (MTD)', yieldMWh: 22.4, consumptionMWh: 14.8, carbonOffsetTons: 13.9, alarms: 0 }
      ];
      if (format === 'json') {
        content = JSON.stringify({
          reportType: 'Monthly Rolling Operations Report',
          asOfDate: selectedDate,
          monthlyAggregates: monthlyData
        }, null, 2);
        mimeType = 'application/json';
      } else {
        const headers = 'Month,Total_Yield_MWh,Industrial_Load_MWh,Carbon_Offset_Tons,Fault_Incidents\n';
        const rows = monthlyData.map(m => `${m.month},${m.yieldMWh},${m.consumptionMWh},${m.carbonOffsetTons},${m.alarms}`).join('\n');
        content = headers + rows;
        mimeType = 'text/csv';
      }
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden font-sans transition-colors duration-300 relative isolate">
      {/* Global Ambient Background Image Backdrop Layer across all elements */}
      {activeBgUrl && backdropActive && (
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-700 select-none -z-20 overflow-hidden"
          style={{ height: '100%', width: '100%' }}
        >
          <div 
            className={cn(
              "absolute inset-0 transition-all duration-1000 scale-[1.03]",
              bgBlur === 'none' ? "blur-none" : bgBlur === 'sm' ? "blur-[6px]" : bgBlur === 'md' ? "blur-[14px]" : "blur-[28px]"
            )}
            style={{
              backgroundImage: `url(${activeBgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: bgOpacity / 100,
            }}
          />
          {/* Subtle dark transparent overlay to elevate contrast and premium visual posture */}
          <div 
            className="absolute inset-0 bg-black/25 bg-gradient-to-b from-black/20 via-black/10 to-black/40" 
          />
          {/* Futuristic Fine Dot Matrix Grid */}
          <div 
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(var(--text-primary) 1.5px, transparent 1.5px)`,
              backgroundSize: '24px 24px',
            }}
          />
        </div>
      )}

      {/* --- Sidebar --- */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
            initial={{ width: 82, opacity: 0 }}
            animate={{ width: isSidebarHovered ? 280 : 82, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="h-full border-r border-[var(--border-color)]/30 bg-[var(--sidebar-bg)]/35 backdrop-blur-xl shrink-0 flex flex-col relative z-30 overflow-hidden"
          >
            <div className="p-5 flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-brand-cyan rounded-lg shadow-lg shadow-brand-cyan/20 shrink-0">
                <CloudLightning className="text-white w-6 h-6" />
              </div>
              <AnimatePresence initial={false}>
                {isSidebarHovered && (
                  <motion.h1 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="font-display font-bold text-lg tracking-tight text-[var(--text-primary)] whitespace-nowrap"
                  >
                    SK POWER <span className="text-brand-cyan font-light italic">CORE</span>
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>

            <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} expanded={isSidebarHovered} />
              <SidebarItem icon={LayoutGrid} label="Asset Tracking" active={activeTab === 'Asset Tracking'} onClick={() => setActiveTab('Asset Tracking')} expanded={isSidebarHovered} />
              <SidebarItem icon={Activity} label="Panel Diagnostics" active={activeTab === 'Panel Diagnostics'} onClick={() => setActiveTab('Panel Diagnostics')} expanded={isSidebarHovered} />
              <SidebarItem icon={TrendingUp} label="Forecasting" active={activeTab === 'Forecasting'} onClick={() => setActiveTab('Forecasting')} expanded={isSidebarHovered} />
              <SidebarItem icon={Zap} label="Peak Analysis" active={activeTab === 'Peak Analysis'} onClick={() => setActiveTab('Peak Analysis')} expanded={isSidebarHovered} />
              <SidebarItem icon={BarChart3} label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} expanded={isSidebarHovered} />
              <SidebarItem icon={Database} label="Big Data Hub" active={activeTab === 'Big Data Hub'} onClick={() => setActiveTab('Big Data Hub')} expanded={isSidebarHovered} />
              <SidebarItem icon={Bell} label="Security" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} expanded={isSidebarHovered} />
              <SidebarItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} expanded={isSidebarHovered} />

              <AnimatePresence initial={false}>
                {isSidebarHovered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-8 px-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)]">System Status</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-500 font-medium whitespace-nowrap">ONLINE</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Grid Load</span>
                        <span className="text-[var(--text-primary)] font-mono">1.2 GW</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Carbon Saved</span>
                        <span className="text-[var(--text-primary)] font-mono">24.5k Tons</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            <div className="p-3 mt-auto border-t border-[var(--border-color)]/30 overflow-hidden">
              <div className={cn(
                "glass-card flex items-center transition-all duration-300",
                isSidebarHovered ? "p-4 gap-3 justify-start" : "p-2 justify-center"
              )}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center border-2 border-[var(--border-color)]/60 shrink-0">
                  <User className="text-white w-5 h-5" />
                </div>
                
                <AnimatePresence initial={false}>
                  {isSidebarHovered && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Shaikh Ramjan</p>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Admin Specialist</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-transparent">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/10 dark:bg-black/35 backdrop-blur-2xl border-b border-white/15 dark:border-white/10 px-8 py-4.5 flex items-center justify-between transition-all duration-300 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors text-[var(--text-secondary)]"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <div>
              <h2 className="text-lg font-display font-semibold text-[var(--text-primary)]">{activeTab}</h2>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • Real-time Monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Grid Date Controller Archive Section */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-cyan/30 rounded-2xl shadow-sm transition-all">
              <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-cyan" />
                <span className="hidden sm:inline">Operational Date:</span>
              </span>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max="2026-12-31"
                className="bg-transparent text-xs font-mono font-bold text-[var(--text-primary)] border-none focus:outline-none focus:ring-0 w-28 cursor-pointer"
              />
              {selectedDate !== '2026-05-23' ? (
                <button 
                  onClick={() => setSelectedDate('2026-05-23')}
                  className="px-2 py-0.5 bg-brand-cyan/10 hover:bg-brand-cyan/25 text-brand-cyan rounded text-[9px] font-black uppercase"
                  title="Reset to Live operational today"
                >
                  Go Live
                </button>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 text-emerald-500 rounded text-[9px] font-black transition-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              )}
            </div>

            <div className="hidden lg:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-brand-cyan transition-colors" />
              <input 
                placeholder="Search panels, alerts..." 
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-brand-cyan/50 focus:ring-4 focus:ring-brand-cyan/10 transition-all w-48 text-[var(--text-primary)]"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const allThemes: ('light' | 'dark' | 'cyberpunk' | 'sunset' | 'ocean' | 'forest')[] = ['light', 'dark', 'cyberpunk', 'sunset', 'ocean', 'forest'];
                  const currentIndex = allThemes.indexOf(theme);
                  const nextIndex = (currentIndex + 1) % allThemes.length;
                  setTheme(allThemes[nextIndex]);
                }}
                className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-brand-cyan/50 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
                title={`Active: ${theme === 'light' ? 'Light Atmosphere' : theme === 'dark' ? 'Deep Space' : theme === 'cyberpunk' ? 'Retro Cyberpunk' : theme === 'sunset' ? 'Sunset Glow' : theme === 'ocean' ? 'Ocean Breeze' : 'Eco Forest'} • Click to Cycle Themes`}
              >
                {theme === 'light' && <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-12 transition-transform" />}
                {theme === 'dark' && <Moon className="w-5 h-5 text-indigo-400 group-hover:-rotate-12 transition-transform" />}
                {theme === 'cyberpunk' && <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />}
                {theme === 'sunset' && <Flame className="w-5 h-5 text-orange-500" />}
                {theme === 'ocean' && <Compass className="w-5 h-5 text-cyan-400" />}
                {theme === 'forest' && <Activity className="w-5 h-5 text-emerald-400" />}
                
                <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-black">
                  {theme === 'light' && 'Light'}
                  {theme === 'dark' && 'Space'}
                  {theme === 'cyberpunk' && 'Cyber'}
                  {theme === 'sunset' && 'Sunset'}
                  {theme === 'ocean' && 'Ocean'}
                  {theme === 'forest' && 'Forest'}
                </span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">Weather</span>
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-tighter">Sunny • 28°C</span>
                </div>
                <div className="p-2 bg-brand-amber/10 rounded-full border border-brand-amber/20">
                  <CloudSun className="text-brand-amber w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] relative isolate">

          {activeTab === 'Dashboard' && (
            <div className="space-y-8 relative z-10 animate-fade-in">

              {/* Gauges Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Gauge label="Solar Efficiency" value={60} unit="%" color="#10b981" status="High" />
                <Gauge label="Power Generation" value={6.5} unit="Kw" color="#f59e0b" status="Moderate" />
                <Gauge label="Energy Consumed" value={79.13} unit="KWh" color="#0ea5e9" status="High" />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Monitoring */}
                <div className="glass-card p-6 flex flex-col">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Performance Monitoring</h3>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-6 w-full">
                      <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">Total Charging</p>
                        <p className="text-3xl font-display font-bold text-emerald-500">80.88</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1">Min 3.0 • Max 6.0</p>
                      </div>
                      <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">Power Usage</p>
                        <p className="text-3xl font-display font-bold text-[var(--text-primary)]">12.35</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1">1 Hour usage 6.8 kwh</p>
                      </div>
                    </div>
                    <div className="relative group overflow-hidden rounded-2xl border border-[var(--border-color)]">
                      <img 
                        src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format&fit=crop" 
                        alt="Solar panels" 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-4 left-4 right-4 glass-card p-3 flex justify-between items-center bg-black/60 backdrop-blur-md border-white/10">
                        <div className="flex items-center gap-2">
                          <Battery className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white">210 kWh</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-brand-cyan" />
                          <span className="text-xs font-bold text-white">178 kwh</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Energy Consumption Detail */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-8">Home Energy Consumption</h3>
                  <div className="space-y-6">
                    <ProgressBarRow label="Meter Power" value="0.8" unit="kw" percentage={50} color="bg-brand-cyan" />
                    <ProgressBarRow label="Meter Energy" value="2.656" unit="kw" percentage={16} color="bg-emerald-500" />
                    <ProgressBarRow label="Utility Meter Uptime" value="75d 4h 25m" unit="" percentage={34} color="bg-brand-amber" />
                  </div>
                  <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">Tariff Settings</h4>
                      <button className="text-[10px] uppercase font-bold text-brand-cyan">View Settings</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Standard Tariff</span>
                        <span className="text-[var(--text-primary)] font-mono">12.8 kwh</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Meter Energy</span>
                        <span className="text-[var(--text-primary)] font-mono">1.56 USD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Energy Consumption History */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Energy Consumption</h3>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-main)] px-2 py-1 rounded border border-[var(--border-color)]">Yearly</span>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.slice(0, 12)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} strokeOpacity={0.4} />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="consumption" stroke="#06b6d4" strokeWidth={3.5} dot={{ r: 3, fill: '#06b6d4', stroke: 'rgba(0,0,0,0.1)' }} activeDot={{ r: 6 }} animationDuration={1000} />
                        <Line type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2, fill: '#10b981' }} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Panel Location Status */}
                <div className="glass-card p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">Pimpri Chinchwad, India</h3>
                      <p className="text-xs text-[var(--text-secondary)]">Maharashtra Sector • 100 Active Units</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('Asset Tracking')}
                      className="text-[10px] uppercase font-bold text-brand-cyan hover:underline"
                    >
                      View Full Registry
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-[var(--border-color)] group">
                        <img 
                          src={`https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=200&auto=format&fit=crop&sig=${i}`} 
                          alt="Cluster" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                     {/* Compact Premium Panel Diagnostics Widget/Card */}
              <div 
                onClick={() => setActiveTab('Panel Diagnostics')}
                className="glass-card glass-card-hover overflow-hidden p-8 md:p-10 cursor-pointer relative group flex flex-col md:flex-row gap-8 items-center justify-between"
              >
                {/* Visual Accent Glow */}
                <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
                <div className="absolute left-0 bottom-0 w-48 h-48 rounded-full bg-brand-cyan/5 blur-[60px] pointer-events-none" />

                {/* Left Side: Elegant Glowing Health Status Gauge */}
                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    {/* SVG Radial Progress Indicator */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className="stroke-[var(--border-color)]/20 fill-none"
                        strokeWidth="8"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className="stroke-emerald-500 fill-none"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - (PANELS.filter(p => p.healthIssue === 'None').length / PANELS.length))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-display font-black text-emerald-500">
                        {Math.round((PANELS.filter(p => p.healthIssue === 'None').length / PANELS.length) * 100)}%
                      </span>
                      <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Health</span>
                    </div>
                  </div>

                  <div className="text-center sm:text-left space-y-2">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 items-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {Math.round((PANELS.filter(p => p.healthIssue === 'None').length / PANELS.length) * 100) >= 75 ? 'Optimal Integrity' : 'Requires Attention'}
                      </span>
                      {PANELS.filter(p => p.healthIssue !== 'None').length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-amber/10 border border-brand-amber/25 text-brand-amber rounded-full text-[10px] font-bold uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3 text-brand-amber animate-pulse" />
                          {PANELS.filter(p => p.healthIssue !== 'None').length} Alerts Active
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">Panel Diagnostics</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed max-w-sm">
                        {PANELS.filter(p => p.healthIssue === 'None').length} of {PANELS.length} connected arrays are operating in optimal status. Click to view fault telemetry, temperature maps, and predictive maintenance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Visual CTA button with Hover Animation */}
                <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-end">
                  <span className="hidden lg:inline text-xs font-semibold text-brand-cyan group-hover:underline">Open Diagnostics Panel</span>
                  <div className="p-3.5 bg-brand-cyan/10 group-hover:bg-brand-cyan border border-brand-cyan/20 group-hover:border-brand-cyan rounded-2xl text-brand-cyan group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1.5">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>          </div>

              {/* Bottom Row Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-lg font-bold text-[var(--text-primary)]">Yield Daily</h3>
                       <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-brand-cyan" />
                             <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Yield Energy</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500" />
                             <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Exported Energy</span>
                          </div>
                       </div>
                    </div>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.slice(0, 10)}>
                             <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} strokeOpacity={0.4} />
                             <XAxis dataKey="time" hide />
                             <YAxis stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} />
                             <Bar dataKey="generation" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={16} />
                             <Bar dataKey="consumption" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={16} />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="glass-card p-6 bg-gradient-to-br from-[var(--bg-card)] to-emerald-500/5">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Battery Status</h3>
                    <div className="flex flex-col items-center justify-center h-48 relative">
                       <div className="w-32 h-32 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 animate-[spin_10s_linear_infinite]" />
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-display font-bold text-emerald-500">92%</span>
                          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Efficiency</span>
                       </div>
                    </div>
                    <div className="mt-8 space-y-4">
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-[var(--text-secondary)]">Charge Level</span>
                          <span className="text-emerald-500 font-bold">Excellent</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-[var(--text-secondary)]">Cycle Count</span>
                          <span className="text-[var(--text-primary)] font-bold">142</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'Panel Diagnostics' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              {/* Title Section with Back to Dashboard Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-brand-cyan font-bold uppercase tracking-widest mb-1.5 pointer-events-auto">
                    <button onClick={() => setActiveTab('Dashboard')} className="hover:underline flex items-center gap-1 cursor-pointer">
                      <ArrowLeft className="w-3 h-3" /> Dashboard
                    </button>
                    <span>•</span>
                    <span>Diagnostics Hub</span>
                  </div>
                  <h2 className="text-3xl font-display font-black text-[var(--text-primary)] tracking-tight">
                    Advanced Panel Diagnostics
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Granular sub-unit electrical diagnostics, fault isolation, and life-cycle telemetry.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab('Dashboard')}
                    className="px-5 py-2.5 bg-[var(--bg-card)] hover:bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-sm cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-cyan" />
                    Back to Dashboard
                  </button>
                </div>
              </div>

              {/* Grid 1: Diagnostic Summary Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 flex items-center gap-4 border border-[var(--border-color)]/30">
                  <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/25 text-emerald-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Average Unit Health</span>
                    <span className="text-2xl font-display font-black text-emerald-500 block mt-0.5">
                      {Math.round((PANELS.filter(p => p.healthIssue === 'None').length / PANELS.length) * 100)}%
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">Optimal operating ranges</span>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 border border-[var(--border-color)]/30">
                  <div className="p-3.5 bg-brand-amber/10 rounded-xl border border-brand-amber/25 text-brand-amber">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Active Warnings</span>
                    <span className="text-2xl font-display font-black text-brand-amber block mt-0.5">
                      {PANELS.filter(p => p.healthIssue !== 'None').length} / {PANELS.length}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">Flags needing cleaning/service</span>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 border border-[var(--border-color)]/30">
                  <div className="p-3.5 bg-brand-cyan/10 rounded-xl border border-brand-cyan/25 text-brand-cyan">
                    <Thermometer className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Avg Cell Temperature</span>
                    <span className="text-2xl font-display font-black text-brand-cyan block mt-0.5">37.4°C</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">Operational thermal baseline</span>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 border border-[var(--border-color)]/30">
                  <div className="p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/25 text-purple-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Predictive Maintenance</span>
                    <span className="text-2xl font-display font-black text-purple-400 block mt-0.5">99.8%</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">System availability estimate</span>
                  </div>
                </div>
              </div>

              {/* Main Workspace: Left detail panel select, Right visualization & controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Selected Unit Interactive Deep Dive */}
                {(() => {
                  const selectedPanel = PANELS.find(p => p.id === selectedDiagPanelId) || PANELS[0];
                  // Simulated dynamic characteristics
                  const simulatedVoltage = Number((38.2 + (selectedPanel.battery / 100) * 12.4 + Math.sin(currentTime.getSeconds() / 15) * 1.5).toFixed(1));
                  const simulatedCurrent = Number(((selectedPanel.irradiance / 20) + Math.cos(currentTime.getSeconds() / 15) * 0.4 + 1.2).toFixed(2));
                  const simulatedPower = Number((simulatedVoltage * simulatedCurrent).toFixed(1));
                  const isHealthy = selectedPanel.healthIssue === 'None';
                  
                  return (
                    <div className="lg:col-span-1 glass-card p-6 flex flex-col justify-between border border-[var(--border-color)]/30 relative overflow-hidden bg-gradient-to-b from-[var(--bg-card)]/50 to-[var(--bg-card)]/80">
                      <div>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-color)]/30">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-brand-cyan tracking-widest block">Selected Array Unit</span>
                            <h4 className="text-xl font-display font-black text-[var(--text-primary)] mt-0.5">{selectedPanel.name}</h4>
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm",
                            selectedPanel.status === 'Active' && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                            selectedPanel.status === 'Charging' && "bg-brand-amber/10 text-brand-amber border border-brand-amber/20",
                            selectedPanel.status === 'Maintenance' && "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                            selectedPanel.status === 'Faulty' && "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                          )}>
                            {selectedPanel.status}
                          </span>
                        </div>

                        {/* Interactive Metrics Grid Container */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[var(--bg-main)]/60 rounded-xl border border-[var(--border-color)]/40 hover:border-[var(--border-color)] transition-all">
                              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Terminal Voltage</span>
                              <span className="text-xl font-mono font-black text-[var(--text-primary)] block mt-1">{simulatedVoltage} V</span>
                              <div className="w-full bg-[var(--border-color)]/20 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-brand-cyan h-full" style={{ width: `${Math.min(100, (simulatedVoltage / 60) * 100)}%` }} />
                              </div>
                            </div>
                            <div className="p-4 bg-[var(--bg-main)]/60 rounded-xl border border-[var(--border-color)]/40 hover:border-[var(--border-color)] transition-all">
                              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Module Current</span>
                              <span className="text-xl font-mono font-black text-[var(--text-primary)] block mt-1">{simulatedCurrent} A</span>
                              <div className="w-full bg-[var(--border-color)]/20 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (simulatedCurrent / 12) * 100)}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[var(--bg-main)]/60 rounded-xl border border-[var(--border-color)]/40 hover:border-[var(--border-color)] transition-all">
                              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Yield Energy Output</span>
                              <span className="text-xl font-mono font-black text-[var(--text-primary)] block mt-1">{simulatedPower} W</span>
                              <span className="text-[9px] text-[var(--text-secondary)]">Watts (V * A)</span>
                            </div>
                            <div className="p-4 bg-[var(--bg-main)]/60 rounded-xl border border-[var(--border-color)]/40 hover:border-[var(--border-color)] transition-all">
                              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Irradiance Index</span>
                              <span className="text-xl font-mono font-black text-[var(--text-primary)] block mt-1">{selectedPanel.irradiance} W/m²</span>
                              <span className="text-[9px] text-[var(--text-secondary)]">Photoelectron capture</span>
                            </div>
                          </div>

                          <div className="p-4 bg-[var(--bg-main)]/60 rounded-xl border border-[var(--border-color)]/40">
                            <div className="flex justify-between text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                              <span>Cell Battery Charge</span>
                              <span>{selectedPanel.battery}%</span>
                            </div>
                            <div className="w-full bg-[var(--border-color)]/20 h-2 rounded-full overflow-hidden">
                              <div className={cn("h-full transition-all duration-300", selectedPanel.battery > 50 ? "bg-emerald-500" : "bg-brand-amber")} style={{ width: `${selectedPanel.battery}%` }} />
                            </div>
                          </div>

                          <div className="p-4 bg-[var(--bg-main)]/60 rounded-xl border border-[var(--border-color)]/40 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-[var(--text-secondary)]">Crystalline Temperature</span>
                              <span className="text-[var(--text-primary)] font-mono font-bold">{selectedPanel.temperature}°C</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-[var(--text-secondary)]">Health Issue Flag</span>
                              <span className={cn("font-bold", isHealthy ? "text-emerald-500" : "text-brand-amber")}>
                                {selectedPanel.healthIssue}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-[var(--text-secondary)]">Maintenance Recommendation</span>
                              <span className="text-[var(--text-primary)] text-right">
                                {selectedPanel.status === 'Faulty' ? 'IMMEDIATE REPAIR' : selectedPanel.healthIssue === 'Needs Cleaning' ? 'Clean surface within 48h' : 'Schedule routine sweep'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dispatch & Operations Control System */}
                      <div className="mt-6 pt-4 border-t border-[var(--border-color)]/30 space-y-4 font-sans">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] tracking-wider uppercase">On-Site Dispatch Terminal</h4>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              const engineerName = selectedPanel.engineers[0] || 'E14';
                              const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              setDiagLogs(prev => [
                                {
                                  id: 'dispatch-' + Math.random().toString(),
                                  timestamp: 'Today ' + timestamp,
                                  panelId: selectedPanel.id,
                                  panelName: selectedPanel.name,
                                  type: 'Engineer Dispatched',
                                  status: 'Dispatched',
                                  detail: `Field maintenance engineer ${engineerName} dispatched to solar unit array. Ticket #D-${Math.floor(Math.random() * 800 + 100)}.`
                                },
                                ...prev
                              ]);
                              setDispatcherMessage(`System dispatched representative ${engineerName} to inspect module ${selectedPanel.name}!`);
                              setTimeout(() => setDispatcherMessage(null), 6000);
                            }}
                            className="w-full px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyan-hover text-white rounded-xl text-xs font-bold font-display shadow-md shadow-brand-cyan/15 flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <Cpu className="w-4 h-4" />
                            Dispatch Engineer {selectedPanel.engineers[0] || 'E14'}
                          </button>

                          <button
                            onClick={() => {
                              const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              setDiagLogs(prev => [
                                {
                                  id: 'calib-' + Math.random().toString(),
                                  timestamp: 'Today ' + timestamp,
                                  panelId: selectedPanel.id,
                                  panelName: selectedPanel.name,
                                  type: 'Remote Calibration',
                                  status: 'Completed',
                                  detail: 'Sent direct micro-inverter offset adjustment signal. Cleaned diagnostic pipeline cache.'
                                },
                                ...prev
                              ]);
                              setDispatcherMessage(`Offset calibration vectors dispatched. Remote telemetry reboot complete for ${selectedPanel.name}.`);
                              setTimeout(() => setDispatcherMessage(null), 6000);
                            }}
                            className="w-full px-4 py-2.5 bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/20 border border-[var(--border-color)] rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Execute Wavephase Calibration
                          </button>
                        </div>

                        {dispatcherMessage && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-400 font-medium"
                          >
                            {dispatcherMessage}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Detail Diagnostic Graphs & Predictors */}
                <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
                  <div className="glass-card p-6 border border-[var(--border-color)]/30 flex-1 bg-gradient-to-br from-[var(--bg-card)]/50 to-[var(--bg-card)]/80 relative">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                      <div>
                        <h4 className="text-md font-bold text-[var(--text-primary)] flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-500" />
                          Voltaic Waveform & Temperature Curves
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Real-time dynamic module voltage tracking versus crystalline operating temperature.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          Live Grid Irradiance Sync
                        </span>
                      </div>
                    </div>

                    {/* Chart space */}
                    <div className="h-64 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.slice(0, 16)}>
                          <defs>
                            <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.6}/>
                              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} strokeOpacity={0.4} />
                          <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} />
                          <Area type="monotone" name="Voltage Offset (V)" dataKey="consumption" stroke="#38bdf8" strokeWidth={3.5} fillOpacity={1} fill="url(#colorVoltage)" />
                          <Area type="monotone" name="Crystalline Temp (°C)" dataKey="temp" stroke="#f87171" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Predictive Maintenance Indicators and Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[var(--border-color)]/30">
                      <div className="p-4 bg-[var(--bg-main)]/50 border border-[var(--border-color)]/25 rounded-2xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-amber mb-2">
                          <Flame className="w-4 h-4 animate-pulse" />
                          <span>Thermal Attenuation Risk</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Micro-inverter efficiency drops roughly by -0.38% per °C past 25°C threshold. Simulated algorithms show 2 units near cooling fluid depletion limits.
                        </p>
                      </div>

                      <div className="p-4 bg-[var(--bg-main)]/50 border border-[var(--border-color)]/25 rounded-2xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan mb-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Dust Attenuation Forecast</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Clean dust coefficient detected at 96.2% base level. Predictive scheduler triggers a cleaning task once attenuation drops beneath 90%.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Filterable Interactive Diagnostic Registry Table */}
              <div className="glass-card overflow-hidden border border-[var(--border-color)]/30 bg-[var(--bg-card)]/50">
                <div className="p-6 border-b border-[var(--border-color)]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)]/30">
                  <div>
                    <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">Unit Health Diagnostics Registry</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">Filter, search, select and execute live microgrid panel assessments.</p>
                  </div>
                  
                  {/* Filters / Search Bar Row */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search Field */}
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        placeholder="Search Panels (e.g. AH-4x1)..."
                        value={diagSearch}
                        onChange={(e) => setDiagSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-cyan"
                      />
                      {diagSearch && (
                        <button onClick={() => setDiagSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">×</button>
                      )}
                    </div>

                    {/* Filter Dropdown buttons */}
                    <div className="flex gap-1 bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)]">
                      {(['All', 'Active', 'Charging', 'Maintenance', 'Faulty'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setDiagFilter(filter)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer",
                            diagFilter === filter 
                              ? "bg-brand-cyan text-white shadow-sm" 
                              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          )}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="overflow-x-auto max-h-[450px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--bg-main)]/90 border-b border-[var(--border-color)]/30 backdrop-blur">
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Code Unit</th>
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Operational Status</th>
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Irradiance</th>
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Current (A)</th>
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Voltage (V)</th>
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Battery Level</th>
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Core Temp</th>
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Health Alerts</th>
                        <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]/30">
                      {(() => {
                        const filtered = PANELS.filter(p => {
                          const matchesFilter = diagFilter === 'All' || p.status === diagFilter;
                          const matchesSearch = p.name.toLowerCase().includes(diagSearch.toLowerCase()) || p.id.includes(diagSearch);
                          return matchesFilter && matchesSearch;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={9} className="text-center py-12 text-sm text-[var(--text-muted)]">
                                No panels match search query or filter constraints.
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((panel) => {
                          const isSelected = selectedDiagPanelId === panel.id;
                          // Standard simulated variables
                          const standardVoltage = Number((38 + (panel.battery / 100) * 12).toFixed(1));
                          const standardCurrent = Number(((panel.irradiance / 20) + 1.2).toFixed(2));

                          return (
                            <tr 
                              key={panel.id} 
                              onClick={() => setSelectedDiagPanelId(panel.id)}
                              className={cn(
                                "cursor-pointer transition-colors group",
                                isSelected ? "bg-brand-cyan/5 hover:bg-brand-cyan/10" : "hover:bg-[var(--bg-main)]/50"
                              )}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {isSelected && <div className="w-1.5 h-6 bg-brand-cyan rounded-full shrink-0 animate-pulse" />}
                                  <span className="font-mono font-bold text-xs text-[var(--text-primary)]">{panel.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter shadow-sm border",
                                  panel.status === 'Active' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                  panel.status === 'Charging' && "bg-brand-amber/10 text-brand-amber border-brand-amber/20",
                                  panel.status === 'Maintenance' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                  panel.status === 'Faulty' && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                                )}>
                                  {panel.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-[var(--text-primary)]">{panel.irradiance} W/m²</td>
                              <td className="px-6 py-4 text-xs font-mono text-[var(--text-primary)]">{standardCurrent} A</td>
                              <td className="px-6 py-4 text-xs font-mono text-[var(--text-primary)]">{standardVoltage} V</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-1.5 bg-[var(--border-color)]/30 rounded-full overflow-hidden">
                                    <div className={cn("h-full", panel.battery > 50 ? "bg-emerald-500" : "bg-brand-amber")} style={{ width: `${panel.battery}%` }} />
                                  </div>
                                  <span className="text-[10px] font-bold text-[var(--text-muted)]">{panel.battery}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-[var(--text-primary)]">{panel.temperature}°C</td>
                              <td className="px-6 py-4">
                                {panel.healthIssue !== 'None' ? (
                                  <div className="flex items-center gap-1.5 text-xs text-brand-amber font-bold">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>{panel.healthIssue}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Optimal</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDiagPanelId(panel.id);
                                    const engineerName = panel.engineers[0] || 'E14';
                                    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    setDiagLogs(prev => [
                                      {
                                        id: 'dispatch-' + Math.random().toString(),
                                        timestamp: 'Today ' + timestamp,
                                        panelId: panel.id,
                                        panelName: panel.name,
                                        type: 'Engineer Dispatched',
                                        status: 'Dispatched',
                                        detail: `Field service supervisor ${engineerName} dispatched to inspect cell. Ticket opened.`
                                      },
                                      ...prev
                                    ]);
                                    setDispatcherMessage(`Ticket opened. Sent rep ${engineerName} directly to inspect ${panel.name}!`);
                                    setTimeout(() => setDispatcherMessage(null), 6000);
                                  }}
                                  className="px-2.5 py-1 bg-brand-cyan/10 hover:bg-brand-cyan text-brand-cyan hover:text-white border border-brand-cyan/25 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer"
                                >
                                  Dispatch
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Historical Diagnostics Logs Section */}
              <div className="glass-card overflow-hidden border border-[var(--border-color)]/30 bg-[var(--bg-card)]/50">
                <div className="p-6 border-b border-[var(--border-color)]/30 bg-[var(--bg-card)]/30">
                  <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">Historical Diagnostics Operations Logs</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Chronological record of system calibrations, dispatched services, fault isolation and microgrid adjustments.</p>
                </div>
                <div className="divide-y divide-[var(--border-color)]/30 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {diagLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-[var(--bg-main)]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[var(--text-muted)]">{log.timestamp}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-cyan">[{log.type}]</span>
                          <span className="font-bold text-[var(--text-primary)]">Unit {log.panelName}</span>
                        </div>
                        <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl">{log.detail}</p>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest",
                          log.status === 'Completed' ? "bg-emerald-500/15 text-emerald-500" :
                          log.status === 'Active' ? "bg-brand-amber/15 text-brand-amber animate-pulse" :
                          "bg-blue-500/15 text-blue-400"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Forecasting' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 animate-fade-in"
            >
              {/* Intelligent Parametric Controller Board */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Sliders & Simulators */}
                <div className="glass-card p-8 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-4">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-brand-cyan" />
                      Meteorological Forecast Factors
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Adjust climatic variables to execute real-time model forecasting simulation.</p>
                  </div>

                  <div className="space-y-5">
                    {/* Irradiance */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--text-secondary)]">Solar Irradiance Target</span>
                        <span className="text-brand-cyan font-bold font-mono">{forecastIrradiance} W/m²</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="400" 
                        value={forecastIrradiance} 
                        onChange={(e) => setForecastIrradiance(Number(e.target.value))}
                        className="w-full accent-brand-cyan bg-[var(--bg-main)] h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-mono">
                        <span>50 (Overcast)</span>
                        <span>400 (Peak Direct Sun)</span>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--text-secondary)] font-semibold">Ambient Temperature</span>
                        <span className="text-amber-500 font-bold font-mono">{forecastTemp}°C</span>
                      </div>
                      <input 
                        type="range" 
                        min="-10" 
                        max="50" 
                        value={forecastTemp} 
                        onChange={(e) => setForecastTemp(Number(e.target.value))}
                        className="w-full accent-amber-500 bg-[var(--bg-main)] h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-mono">
                        <span>-10°C</span>
                        <span>50°C (Thermal Throttling)</span>
                      </div>
                    </div>

                    {/* Cloud Cover */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--text-secondary)]">Cloud Cover Density</span>
                        <span className="text-sky-400 font-bold font-mono">{forecastCloudCover}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={forecastCloudCover} 
                        onChange={(e) => setForecastCloudCover(Number(e.target.value))}
                        className="w-full accent-sky-400 bg-[var(--bg-main)] h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-mono">
                        <span>0% (Clear Sky)</span>
                        <span>100% (Dense Monsoon Overlay)</span>
                      </div>
                    </div>

                    {/* Dust/Albedo */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--text-secondary)]">Aerosol Panel Dust Index</span>
                        <span className="text-yellow-600 font-bold font-mono">{forecastDust}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={forecastDust} 
                        onChange={(e) => setForecastDust(Number(e.target.value))}
                        className="w-full accent-yellow-600 bg-[var(--bg-main)] h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-mono">
                        <span>0% (Pristine Clean)</span>
                        <span>100% (Heavy Accumulation)</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={() => {
                      setForecastLoading(true);
                      setTimeout(() => {
                        setAdjustedForecast(getDeterministicForecast(forecastIrradiance, forecastTemp, forecastCloudCover, forecastDust));
                        setForecastLoading(false);
                      }, 1000);
                    }}
                    disabled={forecastLoading}
                    className="w-full py-4 bg-brand-cyan hover:opacity-90 disabled:bg-[var(--border-color)] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-brand-cyan/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {forecastLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Running Predictive Models...
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 text-white" />
                        Execute Predictive Deep Sweep
                      </>
                    )}
                  </button>
                </div>

                {/* Dashboard & Chart Outputs */}
                <div className="xl:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="glass-card p-6 border-b border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-extrabold block">Confidence Rating</span>
                      <span className="text-2xl font-mono font-black text-brand-cyan block mt-1">
                        {Math.max(45, 98.4 - (forecastCloudCover * 0.3) - (forecastDust * 0.15) - (Math.abs(forecastTemp - 25) * 0.2)).toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] block mt-1">Adjusts dynamically as conditions drift.</span>
                    </div>

                    <div className="glass-card p-6 border-b border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-extrabold block">Accumulated Gen Target</span>
                      <span className="text-2xl font-mono font-black text-emerald-400 block mt-1">
                        {(adjustedForecast.reduce((sum, item) => sum + item.val, 0) / 7).toFixed(1)} MW/d
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] block mt-1">7-Day predicted mean yield.</span>
                    </div>

                    <div className="glass-card p-6 border-b border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-extrabold block">Algorithmic Advisory</span>
                      <span className={cn(
                        "px-2 py-0.5 inline-block rounded text-[10px] font-black uppercase mt-1",
                        forecastCloudCover > 50 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        {forecastCloudCover > 50 ? "SINK RESERVE POWER" : "INJECT BATTERY STORE"}
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] block mt-1">Operational grid sync protocol.</span>
                    </div>
                  </div>

                  {/* Week Chart */}
                  <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Neuronal Week-Ahead Yield Prediction Map</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Custom computed yield forecast curves based on simulated climatic targets</p>
                      </div>
                      <span className="text-[10px] bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-bold px-2 py-0.5 rounded uppercase font-mono">
                        Pimpri Chinchwad Region
                      </span>
                    </div>

                    <div className="h-[280px]">
                      {forecastLoading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                          <div className="w-8 h-8 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs font-mono text-[var(--text-muted)]">Re-inferring LSTM Solar Neural Layers...</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={adjustedForecast}>
                            <defs>
                              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} strokeOpacity={0.4} />
                            <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} 
                              labelFormatter={(label) => `Day: ${label}`}
                            />
                            <Area type="monotone" dataKey="val" name="Yield (MWh)" stroke="#06b6d4" fillOpacity={1} fill="url(#forecastGrad)" strokeWidth={3.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="mt-6 p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
                      <h5 className="text-[11px] font-black uppercase text-brand-cyan flex items-center gap-1">
                        <Cpu className="w-4 h-4" /> Smart Grid Predictive Assessment
                      </h5>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                        Under a requested {forecastIrradiance} W/m² irradiance level and ambient temperatures averaging {forecastTemp}°C (thermal cooling factor of {((1 - Math.abs(forecastTemp - 25) * 0.01) * 100).toFixed(0)}%), the model computes a peak yield ceiling of {Math.max(...adjustedForecast.map(f => f.val))} MWh. Dust coverage of {forecastDust}% restricts glass transmission, introducing an index impedance of {(forecastDust * 0.45).toFixed(1)}%. Recommend {forecastCloudCover > 40 ? "commissioning secondary storage feeds" : "normal high-gain collection pipelines"}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn("w-full transition-all duration-300 mx-auto", settingsSection === 'guide' ? "max-w-6xl" : "max-w-4xl")}
            >
              <div className="glass-card p-6 sm:p-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 border-b border-[var(--border-color)] pb-6">
                  <div>
                    <h3 className="text-3xl font-display font-bold text-[var(--text-primary)]">Settings</h3>
                    <p className="text-[var(--text-secondary)] mt-2">Manage your core interface settings and browse the beginner onboarding documentation.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="bg-brand-cyan/10 px-4 py-2 rounded-xl border border-brand-cyan/20 shrink-0 self-start md:self-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                        <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Version 2.4.1 Peak</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Tab Toggle: General Settings vs Complete Guide */}
                <div className="flex bg-[var(--bg-main)] border border-[var(--border-color)] p-1 rounded-2xl mb-8 max-w-lg">
                  <button 
                    onClick={() => setSettingsSection('general')}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2",
                      settingsSection === 'general'
                        ? "bg-brand-cyan text-white shadow-md shadow-brand-cyan/25"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <Sliders className="w-4 h-4" /> System Configs
                  </button>
                  <button 
                    onClick={() => {
                      setSettingsSection('guide');
                      if (!userOnboardingProgress.includes('read_intro')) {
                        setUserOnboardingProgress([...userOnboardingProgress, 'read_intro']);
                      }
                    }}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2 relative",
                      settingsSection === 'guide'
                        ? "bg-brand-cyan text-white shadow-md shadow-brand-cyan/25"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <BookOpen className="w-4 h-4" /> Help & User Guide
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce border border-[var(--bg-card)]">
                      {userOnboardingProgress.length}
                    </span>
                  </button>
                </div>

                {settingsSection === 'general' ? (
                  <div className="space-y-12 animate-fade-in">
                    {/* Theme Section */}
                    <section>
                      <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-brand-cyan" />
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Interface Theme</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { id: 'light' as const, name: 'Light Atmosphere', desc: 'Stark white interface optimized for high-brightness environments.', color: 'text-amber-500 bg-amber-500/10', icon: Sun },
                          { id: 'dark' as const, name: 'Deep Space', desc: 'Deep, absolute black interface for maximum focus and OLED efficiency.', color: 'text-indigo-400 bg-indigo-500/10', icon: Moon },
                          { id: 'cyberpunk' as const, name: 'Retro Cyberpunk', desc: 'Vibrant retro neon wave experience with high-saturation pinks.', color: 'text-pink-500 bg-pink-500/10', icon: Sparkles },
                          { id: 'sunset' as const, name: 'Sunset Glow', desc: 'Warm, soothing copper hues and amber shadows inspired by suns.', color: 'text-orange-500 bg-orange-500/10', icon: Flame },
                          { id: 'ocean' as const, name: 'Ocean Breeze', desc: 'Cool waves of sparkling deep sea blue and fresh marine highlights.', color: 'text-cyan-400 bg-cyan-500/10', icon: Compass },
                          { id: 'forest' as const, name: 'Eco Forest', desc: 'Eco-friendly rich green and emerald environment for green power.', color: 'text-emerald-400 bg-emerald-500/10', icon: Activity }
                        ].map((tItem) => {
                          const IconComp = tItem.icon;
                          const active = theme === tItem.id;
                          return (
                            <button 
                              key={tItem.id}
                              onClick={() => setTheme(tItem.id)}
                              className={cn(
                                "group relative flex flex-col p-5 rounded-2xl border transition-all text-left cursor-pointer",
                                active 
                                  ? "bg-[var(--bg-card)] border-brand-cyan shadow-xl shadow-brand-cyan/5 ring-2 ring-brand-cyan/20" 
                                  : "bg-[var(--bg-main)]/55 border-[var(--border-color)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-main)]"
                              )}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300",
                                active ? "bg-brand-cyan text-white shadow-lg shadow-brand-cyan/35" : cn("border border-[var(--border-color)] group-hover:scale-105", tItem.color)
                              )}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <p className="font-bold text-[var(--text-primary)] text-sm">{tItem.name}</p>
                              <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">{tItem.desc}</p>
                              {active && (
                                <motion.div layoutId="check-active" className="absolute top-5 right-5">
                                  <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
                                </motion.div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    {/* Dashboard Backdrop Customization Suite */}
                    <section className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-md space-y-6 relative overflow-hidden group">
                      <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full bg-brand-cyan/5 blur-[60px] pointer-events-none" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-5 h-5 text-brand-cyan" />
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Dashboard Backdrop Config</h4>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Configure ambient clean-energy wallpaper rendering</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--text-secondary)]">Backdrop Layer Active:</span>
                          <button 
                            onClick={() => setBackdropActive(!backdropActive)}
                            className={cn(
                              "w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer relative",
                              backdropActive ? "bg-brand-cyan" : "bg-[var(--text-muted)]/30"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
                              backdropActive ? "translate-x-6" : "translate-x-0"
                            )} />
                          </button>
                        </div>
                      </div>

                      {backdropActive && (
                        <div className="space-y-6">
                          {/* Presets and Custom section */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Preset Energy Background Asset
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {DASHBOARD_BACKGROUNDS.map((bgItem) => (
                                  <button
                                    key={bgItem.id}
                                    onClick={() => setDashboardBg(bgItem.id)}
                                    className={cn(
                                      "px-3 py-2.5 rounded-xl border text-xs font-bold text-left justify-between transition-all duration-300 cursor-pointer flex items-center",
                                      dashboardBg === bgItem.id
                                        ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan ring-1 ring-brand-cyan/35"
                                        : "bg-[var(--bg-main)]/50 text-[var(--text-secondary)] border-[var(--border-color)] hover:border-brand-cyan/40"
                                    )}
                                  >
                                    <span className="truncate">{bgItem.name}</span>
                                    {dashboardBg === bgItem.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                                  </button>
                                ))}
                                <button
                                  onClick={() => setDashboardBg('custom')}
                                  className={cn(
                                    "px-3 py-2.5 rounded-xl border text-xs font-bold text-left justify-between transition-all duration-300 cursor-pointer flex items-center",
                                    dashboardBg === 'custom'
                                      ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan ring-1 ring-brand-cyan/35"
                                      : "bg-[var(--bg-main)]/50 text-[var(--text-secondary)] border-[var(--border-color)] hover:border-brand-cyan/40"
                                  )}
                                >
                                  <span>Custom URL...</span>
                                  {dashboardBg === 'custom' && <Check className="w-3.5 h-3.5 shrink-0" />}
                                </button>
                              </div>
                            </div>

                            {/* Custom URL Field */}
                            <div className="space-y-3 justify-center flex flex-col">
                              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                                Custom Backdrop External Image Web URL
                              </label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={customBgUrl}
                                  onChange={(e) => {
                                    setCustomBgUrl(e.target.value);
                                    setDashboardBg('custom');
                                  }}
                                  placeholder="Paste image URL (e.g., https://images.unsplash.com/...)"
                                  className="w-full bg-[var(--bg-main)]/55 border border-[var(--border-color)] hover:border-brand-cyan/40 focus:border-brand-cyan/60 rounded-xl px-4 py-2 text-xs focus:outline-none transition-all text-[var(--text-primary)]"
                                />
                              </div>
                              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic">
                                Paste any absolute image public link. We recommend Unsplash landscape photo keys.
                              </p>
                            </div>
                          </div>

                          {/* Detail tuning parameters */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)]/70">
                            {/* Opacity slider */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-black uppercase tracking-wider text-[var(--text-muted)]">Backdrop Wall opacity</span>
                                <span className="font-mono text-brand-cyan font-bold bg-brand-cyan/10 px-2 py-0.5 rounded text-[10px]">{bgOpacity}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="5" 
                                max="80" 
                                value={bgOpacity}
                                onChange={(e) => setBgOpacity(Number(e.target.value))}
                                className="w-full h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                              />
                              <p className="text-[10px] text-[var(--text-secondary)] leading-tight">
                                Recommended range is 10%-25% for high-contrast light text visibility.
                              </p>
                            </div>

                            {/* Blur Selector */}
                            <div className="space-y-3">
                              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] block">Atmospheric Blur intensity</span>
                              <div className="flex gap-2">
                                {[
                                  { id: 'none' as const, name: 'Crisp (0px)' },
                                  { id: 'sm' as const, name: 'Soft (4px)' },
                                  { id: 'md' as const, name: 'Dreamy (12px)' },
                                  { id: 'lg' as const, name: 'Focus (24px)' }
                                ].map((bItem) => (
                                  <button
                                    key={bItem.id}
                                    onClick={() => setBgBlur(bItem.id)}
                                    style={{ contentVisibility: 'auto' }}
                                    className={cn(
                                      "flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                                      bgBlur === bItem.id
                                        ? "bg-brand-cyan text-white border-brand-cyan"
                                        : "bg-[var(--bg-main)]/50 text-[var(--text-secondary)] border-[var(--border-color)] hover:border-brand-cyan/40"
                                    )}
                                  >
                                    {bItem.name}
                                  </button>
                                ))}
                              </div>
                              <p className="text-[10px] text-[var(--text-secondary)] leading-tight">
                                High blur creates beautiful dreamlike glass reflections that don't distract operators.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </section>

                    {/* Operational Settings (Mock) */}
                    <section>
                      <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-brand-cyan" />
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Operational Controls</h4>
                      </div>
                      <div className="grid gap-4">
                        {[
                          { title: 'AI Yield Prediction', desc: 'Enable neural network forecasting for solar generation.', active: true },
                          { title: 'Thermal Safety Lock', desc: 'Auto-throttle output when panel temperature exceeds 45°C.', active: true },
                          { title: 'Grid Sync Mode', desc: 'Sync energy distribution with public utility fluctuations.', active: false }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/30">
                            <div>
                              <p className="font-bold text-[var(--text-primary)]">{item.title}</p>
                              <p className="text-sm text-[var(--text-secondary)] mt-1">{item.desc}</p>
                            </div>
                            <button className={cn(
                              "w-14 h-7 rounded-full p-1 transition-all duration-300 cursor-pointer",
                              item.active ? "bg-brand-cyan" : "bg-[var(--text-muted)]/30"
                            )}>
                              <div className={cn(
                                "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
                                item.active ? "translate-x-7" : "translate-x-0"
                              )} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="space-y-10 animate-fade-in text-[var(--text-primary)]">
                    {/* ONBOARDING PROGRESS HEADER */}
                    <div className="bg-[var(--bg-main)]/50 border border-[var(--border-color)]/60 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 text-brand-cyan/5 pointer-events-none">
                        <Award className="w-24 h-24 rotate-12" />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <h4 className="text-xs font-black uppercase text-brand-cyan tracking-widest">Operator Onboarding Tracker</h4>
                          <h5 className="text-xl font-bold text-[var(--text-primary)] mt-1">Grid Operator Certification</h5>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-brand-cyan bg-brand-cyan/10 px-3 py-1 rounded-lg border border-brand-cyan/20">
                            {Math.round((userOnboardingProgress.length / 5) * 100)}% Complete
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-[var(--border-color)]/40 h-2 rounded-full overflow-hidden mb-5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(userOnboardingProgress.length / 5) * 100}%` }}
                          className="bg-brand-cyan h-full rounded-full shadow-lg shadow-brand-cyan/40"
                        />
                      </div>
                      
                      {/* Checklist of Interactive Tasks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 text-xs text-[var(--text-secondary)]">
                        {[
                          { id: 'read_intro', label: '1. Read Intro' },
                          { id: 'browse_hadoop', label: '2. Review Big Data' },
                          { id: 'override_safemode', label: '3. Override SafeMode' },
                          { id: 'test_alarms', label: '4. Learn Safety' },
                          { id: 'chatbot_consult', label: '5. Consult operator AI' }
                        ].map((task) => {
                          const done = userOnboardingProgress.includes(task.id);
                          return (
                            <div 
                              key={task.id} 
                              onClick={() => {
                                if (!done) {
                                  setUserOnboardingProgress([...userOnboardingProgress, task.id]);
                                } else {
                                  setUserOnboardingProgress(userOnboardingProgress.filter(x => x !== task.id));
                                }
                              }}
                              className={cn(
                                "flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer select-none",
                                done 
                                  ? "bg-brand-cyan/10 border-brand-cyan/40 text-[var(--text-primary)]" 
                                  : "bg-[var(--bg-main)]/50 border-[var(--border-color)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]"
                              )}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded-md flex items-center justify-center border transition-all shrink-0",
                                done ? "bg-brand-cyan border-brand-cyan text-white" : "border-[var(--text-muted)]/50"
                              )}>
                                {done && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="font-semibold truncate text-[11px]">{task.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* QUICK SEARCH & QUICK MANUAL DOWNLOAD ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input 
                          type="text"
                          placeholder="Search technical topics, HDFS block count, SafeMode keys, alarms..."
                          value={docSearch}
                          onChange={(e) => setDocSearch(e.target.value)}
                          className="w-full bg-[var(--bg-main)]/50 border border-[var(--border-color)] text-xs rounded-xl pl-11 pr-4 py-3 text-[var(--text-primary)] outline-none focus:border-brand-cyan/80 font-sans"
                        />
                        {docSearch && (
                          <button 
                            onClick={() => setDocSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-brand-cyan font-bold"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      
                      <button 
                        onClick={handleDownloadManual}
                        className="px-5 py-3 bg-brand-cyan hover:bg-brand-cyan/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-cyan/20 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" /> Export Offline Guide (TXT)
                      </button>
                    </div>

                    {/* ROTATING DID YOU KNOW CARD */}
                    <div className="bg-gradient-to-r from-brand-cyan/5 to-transparent border border-brand-cyan/10 rounded-2xl p-5 flex items-start gap-4">
                      <div className="p-2 bg-brand-cyan/15 rounded-xl text-brand-cyan shrink-0">
                        <Lightbulb className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-brand-cyan block">Smart Grid Tip / Did You Know?</span>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                          {SMART_TIPS[smartTipIndex]}
                        </p>
                      </div>
                      <button 
                        onClick={() => setSmartTipIndex((prev) => (prev + 1) % SMART_TIPS.length)}
                        className="text-xs font-semibold text-brand-cyan hover:text-white px-2.5 py-1.5 rounded-lg bg-brand-cyan/10 hover:bg-brand-cyan/30 transition-all cursor-pointer whitespace-nowrap shrink-0 self-center"
                      >
                        Next Tip
                      </button>
                    </div>

                    {/* MASTER TABBED WORKSPACE DOCUMENTATION */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Sidemenu content lists */}
                      <div className="lg:col-span-4 space-y-2">
                        <div className="px-3 pb-2 text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">
                          Manual Directory
                        </div>
                        <div className="space-y-1.5">
                          {MANUAL_SECTIONS.map((sec) => (
                            <button 
                              key={sec.id}
                              onClick={() => {
                                setActiveManualSection(sec.id);
                                if (sec.id === 'intro' && !userOnboardingProgress.includes('read_intro')) {
                                  setUserOnboardingProgress([...userOnboardingProgress, 'read_intro']);
                                } else if (sec.id === 'hadoop' && !userOnboardingProgress.includes('browse_hadoop')) {
                                  setUserOnboardingProgress([...userOnboardingProgress, 'browse_hadoop']);
                                }
                              }}
                              className={cn(
                                "w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer",
                                activeManualSection === sec.id && !docSearch
                                  ? "bg-[var(--bg-card)] border-brand-cyan/40 shadow-md shadow-brand-cyan/5 text-brand-cyan font-bold"
                                  : "bg-[var(--bg-main)]/30 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-main)]/60 hover:text-[var(--text-primary)]"
                              )}
                            >
                              <div className="flex items-center gap-3 truncate">
                                {sec.id === 'intro' && <Info className="w-4 h-4 shrink-0" />}
                                {sec.id === 'nav' && <Compass className="w-4 h-4 shrink-0" />}
                                {sec.id === 'hadoop' && <Terminal className="w-4 h-4 shrink-0" />}
                                {sec.id === 'metrics' && <Activity className="w-4 h-4 shrink-0" />}
                                {sec.id === 'warnings' && <ShieldAlert className="w-4 h-4 shrink-0" />}
                                <span className="text-xs truncate">{sec.title.substring(3)}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                          
                          {/* Interactive Tour Section Toggle */}
                          <button 
                            onClick={() => {
                              setActiveManualSection('tour');
                              if (tourStep === null) setTourStep(0);
                            }}
                            className={cn(
                              "w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer",
                              activeManualSection === 'tour' && !docSearch
                                ? "bg-[var(--bg-card)] border-brand-cyan/40 shadow-md shadow-brand-cyan/5 text-brand-cyan font-bold"
                                : "bg-[var(--bg-main)]/30 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-main)]/60 hover:text-[var(--text-primary)]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Play className="w-4 h-4 text-brand-cyan shrink-0" />
                              <span className="text-xs">6. Guided Walkthrough</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                          </button>

                          {/* Professional Glossary Section Toggle */}
                          <button 
                            onClick={() => setActiveManualSection('glossary')}
                            className={cn(
                              "w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer",
                              activeManualSection === 'glossary' && !docSearch
                                ? "bg-[var(--bg-card)] border-brand-cyan/40 shadow-md shadow-brand-cyan/5 text-brand-cyan font-bold"
                                : "bg-[var(--bg-main)]/30 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-main)]/60 hover:text-[var(--text-primary)]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Book className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="text-xs">7. Technical Glossary</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                          </button>

                          {/* Troubleshooting Section Toggle */}
                          <button 
                            onClick={() => setActiveManualSection('trouble')}
                            className={cn(
                              "w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer",
                              activeManualSection === 'trouble' && !docSearch
                                ? "bg-[var(--bg-card)] border-brand-cyan/40 shadow-md shadow-brand-cyan/5 text-brand-cyan font-bold"
                                : "bg-[var(--bg-main)]/30 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-main)]/60 hover:text-[var(--text-primary)]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <ShieldX className="w-4 h-4 text-rose-400 shrink-0" />
                              <span className="text-xs">8. Trouble Troubleshooting</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                          </button>

                          {/* FAQs Section Toggle */}
                          <button 
                            onClick={() => setActiveManualSection('faqs')}
                            className={cn(
                              "w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer",
                              activeManualSection === 'faqs' && !docSearch
                                ? "bg-[var(--bg-card)] border-brand-cyan/40 shadow-md shadow-brand-cyan/5 text-brand-cyan font-bold"
                                : "bg-[var(--bg-main)]/30 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-main)]/60 hover:text-[var(--text-primary)]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                              <span className="text-xs">9. Frequently Asked FAQs</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                          </button>

                          {/* Core AI Operator Assistant toggle */}
                          <button 
                            onClick={() => setActiveManualSection('ai')}
                            className={cn(
                              "w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer",
                              activeManualSection === 'ai' && !docSearch
                                ? "bg-[var(--bg-card)] border-brand-cyan/40 shadow-md shadow-brand-cyan/5 text-brand-cyan font-bold"
                                : "bg-[var(--bg-main)]/30 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-main)]/60 hover:text-[var(--text-primary)]"
                            )}
                          >
                            <div className="flex items-center gap-3 animate-pulse">
                              <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
                              <span className="text-xs">10. Onboarding AI Chatbot</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: DOCUMENT DETAILS CONTAINER */}
                      <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                          {docSearch ? (
                            /* SEARCH RESULTS VIEW */
                            <motion.div 
                              key="search_results"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-6"
                            >
                              <div className="flex justify-between items-center pb-4 border-b border-[var(--border-color)]">
                                <h4 className="text-sm font-black uppercase text-[var(--text-primary)] tracking-widest flex items-center gap-2">
                                  <Search className="w-4 h-4 text-brand-cyan" /> Matched Results for: <span className="text-brand-cyan">"{docSearch}"</span>
                                </h4>
                                <button 
                                  onClick={() => setDocSearch('')}
                                  className="text-xs font-semibold text-brand-cyan hover:underline cursor-pointer"
                                >
                                  Clear Search
                                </button>
                              </div>

                              {/* Perform simple filtered search matching */}
                              {(() => {
                                const results: any[] = [];
                                
                                // Check Manual Sections
                                MANUAL_SECTIONS.forEach(sec => {
                                  let matchScore = 0;
                                  const secMatches: any[] = [];
                                  
                                  if (sec.title.toLowerCase().includes(docSearch.toLowerCase())) matchScore += 10;
                                  if (sec.desc.toLowerCase().includes(docSearch.toLowerCase())) matchScore += 5;
                                  
                                  sec.bullets.forEach(b => {
                                    const titleMatch = b.title.toLowerCase().includes(docSearch.toLowerCase());
                                    const descMatch = b.desc.toLowerCase().includes(docSearch.toLowerCase());
                                    const detailMatch = b.detail?.toLowerCase().includes(docSearch.toLowerCase());
                                    
                                    if (titleMatch || descMatch || detailMatch) {
                                      matchScore += 3;
                                      secMatches.push(b);
                                    }
                                  });
                                  
                                  if (matchScore > 0) {
                                    results.push({
                                      type: 'section',
                                      sectionId: sec.id,
                                      sectionTitle: sec.title,
                                      sectionDesc: sec.desc,
                                      matches: secMatches,
                                      score: matchScore
                                    });
                                  }
                                });

                                // Check FAQs
                                const faqMatches: any[] = [];
                                FAQS.forEach(faq => {
                                  if (faq.q.toLowerCase().includes(docSearch.toLowerCase()) || faq.a.toLowerCase().includes(docSearch.toLowerCase())) {
                                    faqMatches.push(faq);
                                  }
                                });
                                if (faqMatches.length > 0) {
                                  results.push({
                                    type: 'faq',
                                    sectionTitle: "Matching Frequently Asked FAQs",
                                    matches: faqMatches,
                                    score: 5
                                  });
                                }

                                if (results.length === 0) {
                                  return (
                                    <div className="p-12 text-center bg-[var(--bg-main)]/30 border border-[var(--border-color)]/50 rounded-2xl">
                                      <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4 stroke-1.5 animate-pulse" />
                                      <h5 className="font-bold text-[var(--text-primary)]">No exact documentation records matches found</h5>
                                      <p className="text-xs text-[var(--text-secondary)] mt-2 max-w-md mx-auto leading-relaxed">
                                        We couldn't locate any logs matching your query. Try searching for common operational guidelines like "HDFS", "SafeMode", "Carbon Saved", "Alarms", or "Thermal Auto throttle".
                                      </p>
                                    </div>
                                  );
                                }

                                return results.map((res, index) => (
                                  <div key={index} className="bg-[var(--bg-main)]/20 border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                      <h5 className="font-bold text-sm text-[var(--text-primary)]">
                                        {res.sectionTitle}
                                      </h5>
                                      {res.type === 'section' && (
                                        <button 
                                          onClick={() => {
                                            setActiveManualSection(res.sectionId);
                                            setDocSearch('');
                                          }}
                                          className="text-[10px] font-black uppercase text-brand-cyan hover:underline cursor-pointer"
                                        >
                                          Jump to Chapter
                                        </button>
                                      )}
                                    </div>
                                    
                                    {res.type === 'section' && (
                                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-brand-cyan/40 pl-3">
                                        {res.sectionDesc}
                                      </p>
                                    )}

                                    <div className="space-y-4 pt-2">
                                      {res.type === 'section' ? (
                                        res.matches.map((item: any, bid: number) => (
                                          <div key={bid} className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-color)]/40 rounded-xl space-y-1.5">
                                            <h6 className="font-bold text-xs text-brand-cyan">{item.title}</h6>
                                            <p className="text-xs text-[var(--text-primary)]">{item.desc}</p>
                                            {item.detail && <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{item.detail}</p>}
                                          </div>
                                        ))
                                      ) : (
                                        res.matches.map((item: any, bid: number) => (
                                          <div key={bid} className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-color)]/40 rounded-xl space-y-2">
                                            <h6 className="font-bold text-xs text-purple-400 flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> {item.q}</h6>
                                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                ));
                              })()}
                            </motion.div>
                          ) : activeManualSection === 'tour' ? (
                            /* SIMULATED TOUR WORKSPACE */
                            <motion.div
                              key="tour_panel"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="bg-[var(--bg-main)]/20 border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6"
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[var(--border-color)]">
                                <div>
                                  <h4 className="text-sm font-black uppercase text-brand-cyan tracking-widest flex items-center gap-2">
                                    <Play className="w-4 h-4 text-brand-cyan" /> Operator Walkthrough Simulation
                                  </h4>
                                  <p className="text-[10px] text-[var(--text-muted)] mt-1">Practice dashboard calibrations in this risk-free telemetry trainer</p>
                                </div>
                                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                                  Step {tourStep !== null ? tourStep + 1 : 1} of 4
                                </span>
                              </div>

                              {/* Tour Steps Flow */}
                              {tourStep === 0 && (
                                <div className="space-y-4 animate-fade-in">
                                  <h5 className="font-bold text-sm text-[var(--text-primary)]">Training Area 1: Inspecting the Solar array gauges</h5>
                                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    As clean grids controller, you must verify that generator statistics and grid load frequencies are synchronized continuously.
                                  </p>
                                  <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]/55 space-y-3.5">
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-[var(--text-muted)] font-mono">SIMULATION FEEDER VALUE</span>
                                      <span className="font-mono text-brand-cyan font-bold">49.92 Hz</span>
                                    </div>
                                    <div className="w-full bg-[var(--bg-main)]/80 p-3.5 rounded-lg border border-cyan-500/20 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs font-mono">
                                      <div>
                                        <p className="text-brand-cyan font-bold">Grid Status: OUT-OF-SYNCHRONIZATION RISK</p>
                                        <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-relaxed">Frequency is running at 49.92 Hz. Recommended grid calibration index trigger limit is 50.00 Hz.</p>
                                      </div>
                                      <button 
                                        onClick={() => {
                                          if (!userOnboardingProgress.includes('override_safemode')) {
                                            setUserOnboardingProgress([...userOnboardingProgress, 'override_safemode']);
                                          }
                                          alert("Success: Calibrated solar distribution grids to 50.00 Hz! Step 1 cleared.");
                                          setTourStep(1);
                                        }}
                                        className="px-3.5 py-2 bg-brand-cyan text-white text-[11px] font-bold rounded-lg cursor-pointer hover:bg-brand-cyan/80 shadow-md transition-all whitespace-nowrap"
                                      >
                                        Force Calibration
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {tourStep === 1 && (
                                <div className="space-y-4 animate-fade-in">
                                  <h5 className="font-bold text-sm text-[var(--text-primary)]">Training Area 2: Hadoop SafeMode File Audits</h5>
                                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    Upon initial startup bootstrap, NameNode sets SafeMode to on to verify block allocations. Let's practice overriding SafeMode manually to allow logs writing.
                                  </p>
                                  <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]/55 space-y-3">
                                    <div className="flex justify-between items-center text-xs font-mono">
                                      <span className="text-[var(--text-muted)]">SYSTEM BLOCK LEVEL</span>
                                      <span className="text-amber-400 font-bold">128/128 Blocks (99.8% Replicated)</span>
                                    </div>
                                    <div className="w-full bg-[var(--bg-main)]/80 p-3.5 rounded-lg border border-amber-500/20 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs font-mono">
                                      <div>
                                        <p className="text-amber-400 font-bold">NameNode State: SafeMode (Locked - Read Only)</p>
                                        <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-relaxed">Replications checking index is 99.8%. Complete block write replication coverage is missing 0.2%.</p>
                                      </div>
                                      <button 
                                        onClick={() => {
                                          alert("Success: Manual override SafeMode switch engaged! Hadoop filesystem is write-unlocked.");
                                          setTourStep(2);
                                        }}
                                        className="px-3.5 py-2 bg-amber-500 text-black text-[11px] font-bold rounded-lg cursor-pointer hover:bg-amber-400 transition-all font-sans whitespace-nowrap"
                                      >
                                        Unlock SafeMode
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {tourStep === 2 && (
                                <div className="space-y-4 animate-fade-in">
                                  <h5 className="font-bold text-sm text-[var(--text-primary)]">Training Area 3: Inspect Solar Grid Diagnostics</h5>
                                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    Solar Asset Diagnostics let you filter grid units and dispatch engineers immediately. Click on the faulty solar unit below to dispatch E14.
                                  </p>
                                  <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]/55 space-y-3">
                                    <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-black">SOLAR DIAGNOSTIC MATRIX PREVIEW</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-center text-[10px] font-mono">
                                        UNIT-01<br/>Healthy
                                      </div>
                                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-center text-[10px] font-mono">
                                        UNIT-02<br/>Healthy
                                      </div>
                                      <div 
                                        onClick={() => {
                                          alert("Success: Engineer roster E14 holds credentials. Solar Diagnostic audit dispatched successfully!");
                                          setTourStep(3);
                                        }}
                                        className="p-2.5 bg-rose-500/20 border border-rose-500 text-rose-500 rounded text-center text-[10px] font-mono cursor-pointer animate-pulse"
                                      >
                                        UNIT-03<br/>Needs Clean ⚡
                                      </div>
                                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-center text-[10px] font-mono">
                                        UNIT-04<br/>Healthy
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {tourStep === 3 && (
                                <div className="space-y-4 animate-fade-in">
                                  <h5 className="font-bold text-sm text-[var(--text-primary)]">Training Area 4: Thermal Lock Safeguards</h5>
                                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    High ambient temperatures jeopardize solar hardware. Toggle on the auto-throttling safety lock below to resolve high temperature warnings.
                                  </p>
                                  <div className="p-5 bg-[var(--bg-card)] rounded-xl border border-rose-500/20 space-y-4 text-xs font-mono">
                                    <div className="flex justify-between items-center">
                                      <span className="text-rose-500 font-bold">WARNING: Zone 4 Panels overheating!</span>
                                      <span className="text-rose-400 font-bold">48.2°C</span>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        if (!userOnboardingProgress.includes('test_alarms')) {
                                          setUserOnboardingProgress([...userOnboardingProgress, 'test_alarms']);
                                        }
                                        alert("Congratulations! Operator Training Walkthrough complete! You have cleared all calibration tutorials.");
                                        setTourStep(0);
                                        setActiveManualSection('intro');
                                      }}
                                      className="w-full text-center py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-bold rounded-lg transition-colors cursor-pointer text-xs"
                                    >
                                      Enable Thermal Safety Lockdown Switch
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Back and Next controls */}
                              <div className="flex justify-between pt-4 border-t border-[var(--border-color)] text-xs font-bold gap-4">
                                <button 
                                  onClick={() => setTourStep(prev => prev !== null && prev > 0 ? prev - 1 : 0)}
                                  className="px-3.5 py-2 bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                                >
                                  Previous Simulation
                                </button>
                                <button 
                                  onClick={() => setTourStep(prev => prev !== null && prev < 3 ? prev + 1 : 0)}
                                  className="px-3.5 py-2 bg-brand-cyan/20 text-brand-cyan rounded-lg hover:bg-brand-cyan/30 transition-colors cursor-pointer"
                                >
                                  Skip Step
                                </button>
                              </div>
                            </motion.div>
                          ) : activeManualSection === 'faqs' ? (
                            /* FAQS ACCORDIONS VIEW */
                            <motion.div 
                              key="faqs_panel"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="bg-[var(--bg-main)]/20 border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6"
                            >
                              <div>
                                <h4 className="text-sm font-black uppercase text-purple-400 tracking-widest flex items-center gap-2">
                                  <HelpCircle className="w-4 h-4" /> Frequently Asked FAQs
                                </h4>
                                <p className="text-[10px] text-[var(--text-muted)] mt-1">Common administrative inquiries and procedural answers</p>
                              </div>

                              <div className="space-y-4">
                                {FAQS.map((faq, idx) => {
                                  const isOpen = openFaq === idx;
                                  return (
                                    <div 
                                      key={idx}
                                      className="border border-[var(--border-color)]/60 rounded-xl overflow-hidden transition-all duration-300"
                                    >
                                      <button 
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full text-left p-4 bg-[var(--bg-card)]/50 hover:bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)] flex justify-between items-center transition-colors cursor-pointer gap-4"
                                      >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={cn("w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 shrink-0", isOpen && "rotate-180 text-brand-cyan")} />
                                      </button>
                                      {isOpen && (
                                        <motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          className="p-4 bg-[var(--bg-main)]/30 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/20"
                                        >
                                          {faq.a}
                                        </motion.div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          ) : activeManualSection === 'glossary' ? (
                            /* OPERATIONAL GLOSSARY TERMS */
                            <motion.div 
                              key="glossary_panel"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="bg-[var(--bg-main)]/20 border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6"
                            >
                              <div>
                                <h4 className="text-sm font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                                  <Book className="w-4 h-4" /> Professional Glossary of Terms
                                </h4>
                                <p className="text-[10px] text-[var(--text-muted)] mt-1">Authoritative guide explaining grid terminology and cluster jargon</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                  { t: "Solar Photovoltaic Zenith", d: "The precise solar path angle at high noon, yielding the maximum light saturation indices orthogonally for panels." },
                                  { t: "Impedance Rift Threshold", d: "Unbalanced network electrical resistance level that can hamper grid transmissions if panel connectors aren't balanced." },
                                  { t: "HDFS Rack Awareness Policy", d: "Algorithm where Hadoop stores block copies on separate server racks so failure of a complete network switch doesn't delete data." },
                                  { t: "YARN NodeManager daemon", d: "The local node agent that launches containers to perform heavy big-data batch map-reductions under scheduler orders." },
                                  { t: "Thermal Throttling Override", d: "Trigger system that self-attenuates solar current generation to restrict internal physical wafer melting when cells overheat." },
                                  { t: "Grid Frequency Synchronization", d: "Matching solar current output to local grids at exactly 50 Hertz to prevent equipment damage." }
                                ].map((g, i) => (
                                  <div key={i} className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)]/50 rounded-xl space-y-1.5 hover:border-emerald-500/30 transition-colors">
                                    <h5 className="font-bold text-xs text-emerald-400 font-mono">{g.t}</h5>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{g.d}</p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ) : activeManualSection === 'trouble' ? (
                            /* TROUBLESHOOTING PLAYBOOK */
                            <motion.div 
                              key="troubleshoot_panel"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="bg-[var(--bg-main)]/20 border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6"
                            >
                              <div>
                                <h4 className="text-sm font-black uppercase text-rose-400 tracking-widest flex items-center gap-2">
                                  <ShieldX className="w-4 h-4 text-rose-400 animate-pulse" /> Operational Troubleshooting Playbook
                                </h4>
                                <p className="text-[10px] text-[var(--text-muted)] mt-1">Direct remediation formulas for common telemetry anomalies</p>
                              </div>

                              <div className="space-y-4 font-sans text-xs">
                                {[
                                  {
                                    p: "Solar grid reporting abnormally low generation relative to ambient daylight indexes.",
                                    s: "Check for high localized dust accumulation filters inside Forecasting dashboard. Dispatch maintenance team to complete a cleaning checklist if panel is flagged 'Needs Cleaning' in the Diagnostics database."
                                  },
                                  {
                                    p: "NameNode raises 'File system holds under-replicated data blocks' warnings.",
                                    s: "Usually triggered on physical restarts because DataServer workers are sending heartbeats. Do not trigger override unless safe; allow MapReduce engine to balance replication index to 3x."
                                  },
                                  {
                                    p: "Reports daily table exports containing missing chronological timestamps.",
                                    s: "Use the Date Adjuster in Daily Reports view to enforce a past calendar day context. The system automatically fetches stored HDFS file tables and maps metrics correctly."
                                  }
                                ].map((item, i) => (
                                  <div key={i} className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)]/50 rounded-xl space-y-2.5 hover:border-rose-500/20 transition-colors">
                                    <p className="font-bold text-rose-400 flex items-center gap-1.5">
                                      <AlertTriangle className="w-4 h-4 shrink-0" /> Problem: {item.p}
                                    </p>
                                    <p className="text-[var(--text-secondary)] border-l-2 border-[var(--border-color)] pl-3 leading-relaxed">
                                      <span className="font-semibold text-[var(--text-primary)]">Remediation:</span> {item.s}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ) : activeManualSection === 'ai' ? (
                            /* CHATBOT OPERATOR ASSISTANT */
                            <motion.div 
                              key="ai_panel"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="bg-[var(--bg-main)]/20 border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6"
                            >
                              <div className="pb-4 border-b border-[var(--border-color)]">
                                <h4 className="text-sm font-black uppercase text-yellow-500 tracking-widest flex items-center gap-2 animate-pulse">
                                  <Sparkles className="w-4 h-4 text-yellow-500" /> Integrated Onboarding Assistant AI
                                </h4>
                                <p className="text-[10px] text-[var(--text-muted)] mt-1">Ask questions about Hadoop Big Data directory, SafeMode, and thermal locks</p>
                              </div>

                              {/* Chat messages list */}
                              <div className="h-[240px] bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-xl p-4 overflow-y-auto space-y-4 custom-scrollbar text-xs">
                                {chatbotMessages.map((msg, index) => (
                                  <div 
                                    key={index}
                                    className={cn(
                                      "p-3 rounded-xl max-w-[85%] leading-relaxed",
                                      msg.sender === 'user' 
                                        ? "bg-brand-cyan/25 border border-brand-cyan/30 text-[var(--text-primary)] ml-auto" 
                                        : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)]"
                                    )}
                                  >
                                    <p className="font-semibold text-[9px] uppercase tracking-wider mb-1 text-[var(--text-muted)]">
                                      {msg.sender === 'user' ? 'Operator' : 'AI Assistant'}
                                    </p>
                                    <p>{msg.text}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Chat query input */}
                              <form onSubmit={handleChatSubmit} className="flex gap-2">
                                <input 
                                  type="text"
                                  placeholder="Type: 'Explain SafeMode override' or 'How does MapReduce run optimization?'..."
                                  value={chatbotQuery}
                                  onChange={(e) => setChatbotQuery(e.target.value)}
                                  className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] text-xs rounded-xl px-4 py-3 outline-none focus:border-brand-cyan/80 font-sans text-[var(--text-primary)]"
                                />
                                <button 
                                  type="submit"
                                  className="px-5 bg-brand-cyan hover:bg-brand-cyan/90 text-white rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Send className="w-3.5 h-3.5" /> Send
                                </button>
                              </form>
                            </motion.div>
                          ) : (
                            /* STANDARD ARTICLES CHAPTER VIEW */
                            (() => {
                              const sec = MANUAL_SECTIONS.find(m => m.id === activeManualSection);
                              if (!sec) return null;
                              return (
                                <motion.div 
                                  key={sec.id}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -12 }}
                                  className="space-y-6"
                                >
                                  {/* Chapter Title and category */}
                                  <div className="pb-4 border-b border-[var(--border-color)] flex justify-between items-center gap-4">
                                    <div>
                                      <span className="text-[10px] font-black uppercase text-brand-cyan tracking-widest">{sec.category}</span>
                                      <h4 className="text-lg font-bold text-[var(--text-primary)] mt-1">{sec.title}</h4>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] bg-[var(--border-color)]/30 px-2.5 py-1 rounded shrink-0 whitespace-nowrap">
                                      CHAPTER ID: {sec.id.toUpperCase()}
                                    </span>
                                  </div>

                                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                                    {sec.desc}
                                  </p>

                                  {/* Bullet details */}
                                  <div className="space-y-4">
                                    {sec.bullets.map((b, bi) => (
                                      <div key={bi} className="bg-[var(--bg-card)] border border-[var(--border-color)]/50 rounded-2xl p-5 space-y-2 hover:border-brand-cyan/30 transition-all group">
                                        <h5 className="font-bold text-xs text-[var(--text-primary)] group-hover:text-brand-cyan transition-colors flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full shrink-0" />
                                          {b.title}
                                        </h5>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-3.5">
                                          {b.desc}
                                        </p>
                                        {b.detail && (
                                          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed bg-[var(--bg-main)]/40 p-2.5 rounded-lg border border-[var(--border-color)]/30 pl-3.5 italic">
                                            <span className="font-bold uppercase text-[9px] tracking-wider block text-brand-cyan not-italic mb-1">In-Depth Operator Context:</span>
                                            {b.detail}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              );
                            })()
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Asset Tracking' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="glass-card p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-[var(--text-primary)]">Industrial Asset Registry</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Live monitoring of all 100 power collection units</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <p className="text-[10px] text-emerald-500 font-bold uppercase">Optimal</p>
                      <p className="text-lg font-bold text-emerald-500">82</p>
                    </div>
                    <div className="px-4 py-2 bg-brand-amber/10 border border-brand-amber/20 rounded-xl">
                      <p className="text-[10px] text-brand-amber font-bold uppercase">Warning</p>
                      <p className="text-lg font-bold text-brand-amber">12</p>
                    </div>
                    <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                      <p className="text-[10px] text-rose-500 font-bold uppercase">Critical</p>
                      <p className="text-lg font-bold text-rose-500">6</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[800px] overflow-y-auto custom-scrollbar border border-[var(--border-color)] rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[var(--bg-main)] border-b border-[var(--border-color)]">
                        <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Unit ID</th>
                        <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                        <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Engineers</th>
                        <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Efficiency</th>
                        <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Health Diagnostic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]/30">
                      {PANELS.map((panel) => (
                        <tr key={panel.id} className="hover:bg-[var(--bg-main)]/50 transition-colors group">
                          <td className="px-8 py-4 font-mono text-sm text-[var(--text-primary)]">{panel.name}</td>
                          <td className="px-8 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                              panel.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" : "bg-brand-amber/10 text-brand-amber"
                            )}>
                              {panel.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-xs text-[var(--text-secondary)]">{panel.engineers.join(', ')}</td>
                          <td className="px-8 py-4">
                            <div className="w-24 h-1.5 bg-[var(--border-color)]/30 rounded-full overflow-hidden">
                              <div className={cn("h-full", panel.battery > 70 ? "bg-emerald-500" : "bg-brand-amber")} style={{ width: `${panel.battery}%` }} />
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <span className={cn(
                              "text-xs font-bold",
                              panel.healthIssue === 'None' ? "text-emerald-500" : "text-brand-amber"
                            )}>
                              {panel.healthIssue === 'None' ? 'Optimal Performance' : panel.healthIssue}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Peak Analysis' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="glass-card p-8">
                <div className="mb-12">
                  <h3 className="text-3xl font-display font-bold text-[var(--text-primary)]">Peak Load Intelligence</h3>
                  <p className="text-[var(--text-secondary)] mt-2">Correlation analysis between solar peaks and industrial demand in the Pimpri Chinchwad grid.</p>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="h-96 glass-card p-6 border border-brand-cyan/20">
                    <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Efficiency Overload Sync</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.slice(0, 24)}>
                        <defs>
                          <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} strokeOpacity={0.4} />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="generation" stroke="#38bdf8" strokeWidth={3} fill="url(#colorPeak)" />
                        <Area type="step" dataKey="consumption" stroke="#f59e0b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-8 bg-brand-cyan/5 border border-brand-cyan/20 rounded-3xl">
                      <div className="w-10 h-10 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="text-brand-cyan w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Peak Amplitude</p>
                      <h5 className="text-3xl font-display font-bold text-[var(--text-primary)] mt-1">428.5 kW</h5>
                      <p className="text-xs text-brand-cyan font-bold mt-2">Reached at 13:42 IST</p>
                    </div>
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                        <Zap className="text-emerald-500 w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Grid Stability</p>
                      <h5 className="text-3xl font-display font-bold text-[var(--text-primary)] mt-1">98.2%</h5>
                      <p className="text-xs text-emerald-500 font-bold mt-2">Stable load distribution</p>
                    </div>
                    <div className="md:col-span-2 p-6 glass-card border border-[var(--border-color)]">
                       <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase mb-4">Anisotropy Index</h4>
                       <div className="flex gap-1 h-2 bg-[var(--bg-main)] rounded-full overflow-hidden">
                          <div className="w-[40%] bg-brand-cyan" />
                          <div className="w-[30%] bg-emerald-500" />
                          <div className="w-[10%] bg-brand-amber" />
                          <div className="w-[20%] bg-rose-500" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'Security' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text-primary)]">Industrial Security Logs</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Live critical alerts and active fault notifications</p>
                    </div>
                    <button 
                      onClick={() => setAlerts([])}
                      className="px-4 py-2 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                    >
                      CLEAR ALL FAULTS
                    </button>
                  </div>
                  <div className="space-y-4">
                    {alerts.length === 0 ? (
                      <div className="p-8 text-center border-2 border-dashed border-[var(--border-color)] rounded-2xl">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                        <p className="text-sm font-bold text-[var(--text-primary)]">All Core Channels are Secure</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Zero active intrusion threats or voltage thresholds exceeded.</p>
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div key={alert.id} className="p-5 rounded-2xl border border-[var(--border-color)] flex items-start gap-4 hover:shadow-md transition-all">
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                            alert.type === 'error' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                          )}>
                            {alert.type === 'error' ? <X className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-[var(--text-primary)] uppercase tracking-tight text-xs">{alert.type} Incident</p>
                              <span className="text-xs text-[var(--text-muted)] font-mono">{alert.time}</span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)]">{alert.message}</p>
                          </div>
                          <button 
                            onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                            className="text-[10px] text-[var(--text-muted)] hover:text-rose-500 font-bold cursor-pointer"
                          >
                            DISMISS
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Alert Controller Generation Console */}
              <div className="space-y-6">
                <div className="glass-card p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <BellRing className="w-5 h-5 text-brand-cyan" />
                      Alert Generation Unit
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Simulate and inject customized grid alerts into the Big Data hub and security panels.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] font-bold block mb-1.5 uppercase tracking-wide">Severity Level</label>
                      <select 
                        value={alertFormType}
                        onChange={(e) => setAlertFormType(e.target.value as Alert['type'])}
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-primary)] outline-none focus:border-brand-cyan"
                      >
                        <option value="warning">Warning (Impedance Drift/Warning)</option>
                        <option value="error">Error (Thermal Overheat/Inoperable)</option>
                        <option value="info">Information (Grid Sync Standard)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-[var(--text-secondary)] font-bold block mb-1.5 uppercase tracking-wide">Incident Message</label>
                      <input 
                        type="text" 
                        value={alertFormMessage}
                        onChange={(e) => setAlertFormMessage(e.target.value)}
                        placeholder="e.g. PC-Zone 4 thermal loop overflow..."
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-primary)] outline-none focus:border-brand-cyan"
                      />
                    </div>

                    <button 
                      onClick={() => {
                        if (!alertFormMessage.trim()) return;
                        const newAlert: Alert = {
                          id: Date.now().toString(),
                          type: alertFormType,
                          message: alertFormMessage.trim(),
                          time: "Just Now"
                        };
                        setAlerts([newAlert, ...alerts]);
                        setAlertFormMessage('');
                      }}
                      className="w-full py-3.5 bg-brand-cyan hover:opacity-90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-cyan/15"
                    >
                      <ShieldX className="w-4 h-4 text-white" />
                      Trigger Threshold Interrupt
                    </button>
                  </div>
                </div>

                <div className="glass-card p-8 space-y-6">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Security Protocols</h3>
                  <div className="space-y-4 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Intrusion Detection Loop</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Grid Firewall Clusters</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">ENCRYPTED</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Automated Lockdown Standby</span>
                      <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded">STANDBY</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Reports' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 max-w-6xl mx-auto animate-fade-in"
            >
              <div className="glass-card p-10 bg-gradient-to-br from-[var(--bg-card)] to-brand-cyan/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-display font-black text-[var(--text-primary)] flex items-center gap-2">
                    <BarChart3 className="w-8 h-8 text-brand-cyan" />
                    Grid Analytics Report Engine
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-xl">
                    Generate and download high-precision CSV/JSON analytics compiled from the Big Data Hub pipeline. View predictions, incident rates, and compliance offsets for Pimpri Chinchwad.
                  </p>
                </div>

                {/* Sub-tab selection for Daily, Weekly, Monthly, Health */}
                <div className="flex bg-[var(--bg-main)] border border-[var(--border-color)] p-1 rounded-2xl shrink-0 overflow-x-auto max-w-full">
                  {(['daily', 'weekly', 'monthly', 'health'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setReportPeriod(period)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap",
                        reportPeriod === period 
                          ? "bg-brand-cyan text-white shadow-md shadow-brand-cyan/25"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {period === 'health' ? 'Panel Health' : `${period} Analysis`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analytics content display based on selection */}
              {reportPeriod === 'daily' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-5 flex flex-col justify-between relative overflow-hidden">
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase font-black block">Target Date Adjuster</span>
                        <input 
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          max="2026-12-31"
                          className="bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-mono font-bold text-brand-cyan px-2.5 py-1 rounded-xl mt-2 outline-none focus:border-brand-cyan/80 w-full cursor-pointer font-sans"
                        />
                      </div>
                      <div className="flex gap-1.5 mt-2.5 overflow-x-auto pb-0.5">
                        <button 
                          onClick={() => setSelectedDate('2026-05-23')}
                          className={cn(
                            "px-2 py-1 text-[8px] font-bold rounded uppercase transition-colors shrink-0 cursor-pointer",
                            selectedDate === '2026-05-23' ? "bg-brand-cyan text-white" : "bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
                          )}
                        >
                          Today
                        </button>
                        <button 
                          onClick={() => setSelectedDate('2026-05-22')}
                          className={cn(
                            "px-2 py-1 text-[8px] font-bold rounded uppercase transition-colors shrink-0 cursor-pointer",
                            selectedDate === '2026-05-22' ? "bg-brand-cyan text-white" : "bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
                          )}
                        >
                          Yesterday
                        </button>
                        <button 
                          onClick={() => setSelectedDate('2026-05-15')}
                          className={cn(
                            "px-2 py-1 text-[8px] font-bold rounded uppercase transition-colors shrink-0 cursor-pointer",
                            selectedDate === '2026-05-15' ? "bg-brand-cyan text-white" : "bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
                          )}
                        >
                          May 15
                        </button>
                      </div>
                    </div>
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Day Mean Generation</span>
                      <span className="text-xl font-mono font-bold text-emerald-400 block mt-1">
                        {(data.reduce((sum, item) => sum + item.generation, 0) / (data.length || 1)).toFixed(1)} kW
                      </span>
                    </div>
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Active Alerts Count</span>
                      <span className="text-xl font-mono font-bold text-rose-500 block mt-1">
                        {alerts.filter(a => a.type === 'error' || a.type === 'warning').length} Alarms
                      </span>
                    </div>
                  </div>

                  {/* Core Table */}
                  <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Hourly Generation Grid Log - {selectedDate}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Showing exact compiled data metrics of the adjusted target date</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDownloadReport('daily', 'csv')}
                          className="px-3.5 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 rounded-xl text-xs font-bold text-brand-cyan flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> CSV
                        </button>
                        <button 
                          onClick={() => handleDownloadReport('daily', 'json')}
                          className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> JSON
                        </button>
                        <button 
                          onClick={() => handleDownloadReport('daily', 'pdf')}
                          className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Statement
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
                      <table className="w-full text-left font-mono text-xs">
                        <thead className="sticky top-0 bg-[var(--bg-card)]">
                          <tr className="border-b border-[var(--border-color)]">
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Hour</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Generation (kW)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Forecast (kW)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Temp (°C)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Consumption (kW)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/30">
                          {data.map((d, index) => (
                            <tr key={index} className="hover:bg-[var(--bg-main)]/55 transition-colors">
                              <td className="px-6 py-3 font-bold text-[var(--text-primary)]">{d.time}</td>
                              <td className="px-6 py-3 text-right text-brand-cyan font-bold">{d.generation}</td>
                              <td className="px-6 py-3 text-right text-[var(--text-secondary)]">{d.forecast}</td>
                              <td className="px-6 py-3 text-right text-amber-500">{d.temp}</td>
                              <td className="px-6 py-3 text-right text-[var(--text-muted)]">{d.consumption || '185.0'}</td>
                              <td className="px-6 py-3 text-center">
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold rounded">OPTIMAL</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {reportPeriod === 'weekly' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Analysis Interval</span>
                      <span className="text-xl font-mono font-bold text-brand-cyan block mt-1">7 Scheduled Days</span>
                    </div>
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Average Collector Power</span>
                      <span className="text-xl font-mono font-bold text-emerald-400 block mt-1">955.7 kWh</span>
                    </div>
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Carbon Avoided</span>
                      <span className="text-xl font-mono font-bold text-emerald-500 block mt-1">4.07 Metric Tons</span>
                    </div>
                  </div>

                  {/* Core Table */}
                  <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Weekly Solar Yield & Emission Reduction Audit</h4>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Aggregated weekly metrics compiled over the selected epoch</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDownloadReport('weekly', 'csv')}
                          className="px-3.5 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 rounded-xl text-xs font-bold text-brand-cyan flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> CSV
                        </button>
                        <button 
                          onClick={() => handleDownloadReport('weekly', 'json')}
                          className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> JSON
                        </button>
                        <button 
                          onClick={() => handleDownloadReport('weekly', 'pdf')}
                          className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Statement
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="bg-[var(--bg-main)]/50 border-b border-[var(--border-color)]">
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Operating Day</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Total Yield (kWh)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Peak Capacity (kW)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Avg Efficiency</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Cloud Density</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Carbon Salvaged (Kg)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/30">
                          {[
                            { day: 'Monday', yieldKWh: 840, peakKW: 120, efficiency: '84.2%', cloudCover: '10%', carbonSavedKg: 520 },
                            { day: 'Tuesday', yieldKWh: 980, peakKW: 140, efficiency: '85.6%', cloudCover: '15%', carbonSavedKg: 610 },
                            { day: 'Wednesday', yieldKWh: 770, peakKW: 110, efficiency: '81.9%', cloudCover: '35%', carbonSavedKg: 480 },
                            { day: 'Thursday', yieldKWh: 1120, peakKW: 160, efficiency: '88.1%', cloudCover: '8%', carbonSavedKg: 700 },
                            { day: 'Friday', yieldKWh: 1050, peakKW: 150, efficiency: '87.4%', cloudCover: '12%', carbonSavedKg: 650 },
                            { day: 'Saturday', yieldKWh: 910, peakKW: 130, efficiency: '83.5%', cloudCover: '20%', carbonSavedKg: 560 },
                            { day: 'Sunday', yieldKWh: 1010, peakKW: 145, efficiency: '86.2%', cloudCover: '14%', carbonSavedKg: 630 }
                          ].map((w, index) => (
                            <tr key={index} className="hover:bg-[var(--bg-main)]/55 transition-colors">
                              <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{w.day}</td>
                              <td className="px-6 py-4 text-right text-brand-cyan font-bold">{w.yieldKWh} kWh</td>
                              <td className="px-6 py-4 text-right text-[var(--text-secondary)]">{w.peakKW} kW</td>
                              <td className="px-6 py-4 text-right text-emerald-400">{w.efficiency}</td>
                              <td className="px-6 py-4 text-right text-sky-400">{w.cloudCover}</td>
                              <td className="px-6 py-4 text-right text-[var(--text-muted)]">{w.carbonSavedKg} Kg</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {reportPeriod === 'monthly' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Audit Scope</span>
                      <span className="text-xl font-mono font-bold text-brand-cyan block mt-1">Rolling H1 Rollups</span>
                    </div>
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Total Generation</span>
                      <span className="text-xl font-mono font-bold text-emerald-400 block mt-1">137.9 MWh</span>
                    </div>
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Carbon Mitigations</span>
                      <span className="text-xl font-mono font-bold text-sky-400 block mt-1">85.5 Metric Tons</span>
                    </div>
                  </div>

                  {/* Core Table */}
                  <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Monthly Rolling Regional Resource Statement</h4>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Consolidated industrial generation vs regional industrial consumption index</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDownloadReport('monthly', 'csv')}
                          className="px-3.5 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 rounded-xl text-xs font-bold text-brand-cyan flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> CSV
                        </button>
                        <button 
                          onClick={() => handleDownloadReport('monthly', 'json')}
                          className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> JSON
                        </button>
                        <button 
                          onClick={() => handleDownloadReport('monthly', 'pdf')}
                          className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Statement
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="bg-[var(--bg-main)]/50 border-b border-[var(--border-color)]">
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Billing Cycle</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Yield (MWh)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Industrial Sink (MWh)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Node Efficiency</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Carbon Equivalent (Tons)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-center">Incidents</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/30">
                          {[
                            { month: 'January', yieldMWh: 24.8, consumptionMWh: 18.2, efficiencyIndex: '84.2%', carbonOffsetTons: 15.4, alarms: 2 },
                            { month: 'February', yieldMWh: 28.1, consumptionMWh: 19.5, efficiencyIndex: '85.6%', carbonOffsetTons: 17.4, alarms: 1 },
                            { month: 'March', yieldMWh: 32.4, consumptionMWh: 22.0, efficiencyIndex: '81.9%', carbonOffsetTons: 20.1, alarms: 4 },
                            { month: 'April', yieldMWh: 30.2, consumptionMWh: 21.4, efficiencyIndex: '88.1%', carbonOffsetTons: 18.7, alarms: 3 },
                            { month: 'May (MTD)', yieldMWh: 22.4, consumptionMWh: 14.8, efficiencyIndex: '87.4%', carbonOffsetTons: 13.9, alarms: 0 }
                          ].map((m, index) => (
                            <tr key={index} className="hover:bg-[var(--bg-main)]/55 transition-colors">
                              <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{m.month}</td>
                              <td className="px-6 py-4 text-right text-brand-cyan font-bold">{m.yieldMWh} MWh</td>
                              <td className="px-6 py-4 text-right text-[var(--text-secondary)]">{m.consumptionMWh} MWh</td>
                              <td className="px-6 py-4 text-right text-emerald-400">{m.efficiencyIndex}</td>
                              <td className="px-6 py-4 text-right text-sky-400">{m.carbonOffsetTons} Tons</td>
                              <td className="px-6 py-4 text-center">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-black",
                                  m.alarms > 0 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                                )}>
                                  {m.alarms} FAULTS
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {reportPeriod === 'health' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Total Scan Count</span>
                      <span className="text-xl font-mono font-bold text-brand-cyan block mt-1">{PANELS.length} Panels</span>
                    </div>
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Optimal Conditions</span>
                      <span className="text-xl font-mono font-bold text-emerald-400 block mt-1">
                        {PANELS.filter(p => p.healthIssue === 'None').length}% Safe
                      </span>
                    </div>
                    <div className="glass-card p-6">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Degradation Flags</span>
                      <span className="text-xl font-mono font-bold text-amber-500 block mt-1">
                        {PANELS.filter(p => p.healthIssue !== 'None').length} Faulty Units
                      </span>
                    </div>
                  </div>

                  {/* Core Table */}
                  <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Solar Asset Health Diagnostic Report - {selectedDate}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Live operational telemetry scan of the complete collector grid</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDownloadReport('health', 'csv')}
                          className="px-3.5 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 rounded-xl text-xs font-bold text-brand-cyan flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> HTML/CSV
                        </button>
                        <button 
                          onClick={() => handleDownloadReport('health', 'json')}
                          className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> JSON
                        </button>
                        <button 
                          onClick={() => handleDownloadReport('health', 'pdf')}
                          className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Statement
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto max-h-[400px] custom-scrollbar text-mono text-xs">
                      <table className="w-full text-left">
                        <thead className="sticky top-0 bg-[var(--bg-card)]">
                          <tr className="border-b border-[var(--border-color)]">
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Panel Unit</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-center">Status</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Irradiance (W/m²)</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Current Charge</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-right">Temperature</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase text-center font-mono">Health Diagnostic</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/30">
                          {PANELS.slice(0, 30).map((panel) => (
                            <tr key={panel.id} className="hover:bg-[var(--bg-main)]/55 transition-colors">
                              <td className="px-6 py-3 font-bold text-[var(--text-primary)] font-mono">{panel.id}</td>
                              <td className="px-6 py-3 text-center">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                                  panel.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" :
                                  panel.status === 'Charging' ? "bg-blue-500/10 text-blue-500" :
                                  panel.status === 'Maintenance' ? "bg-amber-500/10 text-amber-500" :
                                  "bg-rose-500/10 text-rose-500"
                                )}>
                                  {panel.status}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-right text-[var(--text-secondary)] font-mono">{panel.irradiance}</td>
                              <td className="px-6 py-3 text-right text-[var(--text-muted)] font-mono">{panel.battery}%</td>
                              <td className="px-6 py-3 text-right text-brand-cyan font-mono">{panel.temperature}°C</td>
                              <td className="px-6 py-3 text-center">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                                  panel.healthIssue === 'None' ? "bg-emerald-500/10 text-emerald-500" :
                                  panel.healthIssue === 'Cell Failure' ? "bg-rose-500/10 text-rose-500" :
                                  "bg-amber-500/10 text-amber-500"
                                )}>
                                  {panel.healthIssue === 'None' ? 'HEALTHY' : panel.healthIssue}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {PANELS.length > 30 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-main)]/20 italic font-mono">
                                ... showing top 30 key panels. Use CSV/JSON buttons above to download the full comprehensive 100-panel health audit list.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Big Data Hub' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Header Title Accent */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
                <div>
                  <h3 className="text-3xl font-display font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                    <Database className="w-8 h-8 text-brand-cyan" />
                    big data hub
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Multi-node HDFS Cluster & MapReduce framework simulating generation aggregates across Pimpri Chinchwad, Maharashtra.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl px-5 py-3 shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="text-xs text-[var(--text-primary)] font-bold uppercase block">Hadoop SafeMode</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">OFF (Active Reading-Writing Enabled)</span>
                  </div>
                </div>
              </div>

              {/* Micro Tab Navigation inside Hadoop section */}
              <div className="flex gap-2 p-1 bg-[var(--bg-card)] border border-[var(--border-color)]/80 rounded-2xl max-w-lg shadow-sm">
                <button
                  onClick={() => { setMrTab('cluster'); setSelectedHdfsFile(null); }}
                  className={cn(
                    "flex-1 py-3 text-xs font-bold uppercase transition-all rounded-xl cursor-pointer",
                    mrTab === 'cluster' ? "bg-brand-cyan text-white shadow-md shadow-brand-cyan/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Cluster Topology
                </button>
                <button
                  onClick={() => { setMrTab('mapreduce'); setSelectedHdfsFile(null); }}
                  className={cn(
                    "flex-1 py-3 text-xs font-bold uppercase transition-all rounded-xl cursor-pointer",
                    mrTab === 'mapreduce' ? "bg-brand-cyan text-white shadow-md shadow-brand-cyan/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  YARN MapReduce
                </button>
                <button
                  onClick={() => { setMrTab('hdfs'); setSelectedHdfsFile(null); }}
                  className={cn(
                    "flex-1 py-3 text-xs font-bold uppercase transition-all rounded-xl cursor-pointer",
                    mrTab === 'hdfs' ? "bg-brand-cyan text-white shadow-md shadow-brand-cyan/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  HDFS Browser
                </button>
              </div>

              {/* Sub-view Content Switch */}
              {mrTab === 'cluster' && (
                <div className="space-y-8 animate-fade-in">
                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card p-6 flex flex-col justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-black">Cluster NameNode</span>
                      <h4 className="text-lg font-display font-medium text-[var(--text-primary)] mt-3">namenode.skp.pimpri</h4>
                      <span className="text-xs text-brand-cyan font-mono mt-1">IP: 192.168.10.10</span>
                    </div>
                    <div className="glass-card p-6 flex flex-col justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-black">Hadoop Core Ver</span>
                      <h4 className="text-2xl font-bold font-mono text-brand-cyan mt-3">3.3.6</h4>
                      <span className="text-xs text-[var(--text-muted)] mt-1">Compiled via Maven / OpenJDK 11</span>
                    </div>
                    <div className="glass-card p-6 flex flex-col justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-black">Active Block Count</span>
                      <h4 className="text-2xl font-display font-bold text-emerald-500 mt-3">{hadoopStatus?.hdfsSummary?.totalBlocks || 437}</h4>
                      <span className="text-xs text-[var(--text-muted)] mt-1">Replication Limit: 3x Redundancy</span>
                    </div>
                    <div className="glass-card p-6 flex flex-col justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-black">YARN Node Managers</span>
                      <h4 className="text-2xl font-bold text-[var(--text-primary)] mt-3">3 Online</h4>
                      <span className="text-xs text-emerald-500 font-bold mt-1">● 0 Dead Containers</span>
                    </div>
                  </div>

                  {/* Partitioned main view */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Capacity details */}
                    <div className="glass-card p-8 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-brand-cyan" />
                          HDFS Configured Space
                        </h4>
                        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="72" cy="72" r="62" fill="transparent" stroke="var(--border-color)" strokeWidth="12" />
                            <circle cx="72" cy="72" r="62" fill="transparent" stroke="#0ea5e9" strokeWidth="12" strokeDasharray="389.5" strokeDashoffset="216.9" strokeLinecap="round" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-display font-black text-[var(--text-primary)]">44.3%</span>
                            <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-bold">DFS Used</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--text-secondary)]">Total Configured Capacity:</span>
                          <span className="text-[var(--text-primary)] font-bold font-mono">7.20 TB</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--text-secondary)]">DFS Space Used:</span>
                          <span className="text-brand-cyan font-bold font-mono">3.19 TB</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--text-secondary)]">Remaining DFS Space:</span>
                          <span className="text-emerald-500 font-bold font-mono">3.88 TB</span>
                        </div>
                      </div>
                    </div>

                    {/* DataNodes Grid Status */}
                    <div className="lg:col-span-2 glass-card p-8">
                      <h4 className="text-base font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                        <Network className="w-5 h-5 text-brand-cyan" />
                        Active DataNode Heartbeats
                      </h4>
                      <div className="space-y-4">
                        {(hadoopStatus?.dataNodes || [
                          { name: "datanode-01.skp.pimpri.local", ip: "192.168.10.11", status: "Healthy", blocks: 142, capacity: "2.4 TB", used: "1.2 TB", lastHeartbeat: "1s ago" },
                          { name: "datanode-02.skp.pimpri.local", ip: "192.168.10.12", status: "Healthy", blocks: 156, capacity: "2.4 TB", used: "940 GB", lastHeartbeat: "2s ago" },
                          { name: "datanode-03.skp.pimpri.local", ip: "192.168.10.13", status: "Healthy", blocks: 139, capacity: "2.4 TB", used: "1.05 TB", lastHeartbeat: "1s ago" },
                        ]).map((node: any, idx: number) => (
                          <div key={idx} className="p-5 bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20">
                                <Server className="w-5 h-5 text-brand-cyan" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[var(--text-primary)] font-mono">{node.name}</p>
                                <p className="text-[10px] text-[var(--text-muted)] font-mono">IP: {node.ip} • Block Count: {node.blocks}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                              <div className="text-right">
                                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Capacity Status</span>
                                <span className="text-xs font-semibold text-[var(--text-secondary)] font-mono">{node.used} / {node.capacity}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold font-mono">HEALTHY</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mrTab === 'mapreduce' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Launch Form */}
                    <div className="glass-card p-8 space-y-6">
                      <h4 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
                        <FileCode className="w-5 h-5 text-brand-cyan" />
                        Hadoop Job Configurator
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold block mb-1">YARN App Name</label>
                          <input
                            type="text"
                            defaultValue="SolarPower_PeakOptimizer_PC"
                            disabled
                            className="w-full text-xs font-semibold bg-[var(--bg-main)] p-3 border border-[var(--border-color)] rounded-xl text-[var(--text-muted)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold block mb-1">DFS Input Dataset</label>
                          <input
                            type="text"
                            defaultValue="/user/shaikh/solar_data/pimpri_chinchwad_raw.json"
                            disabled
                            className="w-full text-xs font-mono bg-[var(--bg-main)] p-3 border border-[var(--border-color)] rounded-xl text-[var(--text-muted)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold block mb-1">Target Cluster Data Record Depth</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[1000, 3000, 5000].map((limit) => (
                              <button
                                key={limit}
                                onClick={() => setMrRecordsLimit(limit)}
                                className={cn(
                                  "py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer",
                                  mrRecordsLimit === limit
                                    ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan"
                                    : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-brand-cyan/40"
                                )}
                              >
                                {limit} Pts
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] mt-1">Increasing scale splits workload over multiple block groups.</p>
                        </div>
                      </div>

                      <button
                        onClick={handleRunMapReduce}
                        disabled={mrSubmitting}
                        className={cn(
                          "w-full py-4 text-xs font-bold uppercase tracking-widest text-white rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-lg",
                          mrSubmitting 
                            ? "bg-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed"
                            : "bg-brand-cyan hover:opacity-90 active:scale-95 shadow-brand-cyan/20"
                        )}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        {mrSubmitting ? "Running Job on Cluster..." : "Execute MapReduce Job"}
                      </button>
                    </div>

                    {/* Simulator Tracker progress */}
                    <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-brand-cyan" />
                          YARN Resource Manager Monitor
                        </h4>

                        {/* If job is active/submitted */}
                        {mrSubmitting || mrJobs[0]?.status === 'RUNNING' ? (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center bg-brand-amber/10 border border-brand-amber/20 rounded-xl p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-brand-amber animate-ping" />
                                <span className="text-xs font-bold text-brand-amber uppercase tracking-wider">Deploying App: {mrJobs[0]?.id || "YARN_BOOTING"}</span>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-brand-cyan/25 text-brand-cyan text-[9px] font-black uppercase font-mono">{mrJobs[0]?.phase || "BOOTING"}</span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                  <span className="text-[var(--text-secondary)]">Map Workload Split Tasks ({mrJobs[0]?.mappersCount || 4} Parallel Mappers)</span>
                                  <span className="text-brand-cyan font-bold font-mono">{mrJobs[0]?.progressMap || 0}%</span>
                                </div>
                                <div className="w-full bg-[var(--border-color)]/30 h-2 rounded-full overflow-hidden">
                                  <motion.div className="h-full bg-cyan-500" animate={{ width: `${mrJobs[0]?.progressMap || 0}%` }} transition={{ duration: 0.3 }} />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                  <span className="text-[var(--text-secondary)]">Shuffle & Reducer Tasks (1 Consolidated Reducer Node)</span>
                                  <span className="text-emerald-500 font-bold font-mono">{mrJobs[0]?.progressReduce || 0}%</span>
                                </div>
                                <div className="w-full bg-[var(--border-color)]/30 h-2 rounded-full overflow-hidden">
                                  <motion.div className="h-full bg-emerald-500" animate={{ width: `${mrJobs[0]?.progressReduce || 0}%` }} transition={{ duration: 0.3 }} />
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
                              <p className="text-[10px] text-[var(--text-muted)] font-black uppercase mb-1">Real-time Hadoop Syslog Console</p>
                              <div className="h-28 overflow-y-auto font-mono text-[10px] text-emerald-400 space-y-1 custom-scrollbar">
                                <p>[INFO] org.apache.hadoop.mapreduce.JobSubmitter: Submitting Master Application to YARN...</p>
                                <p>[INFO] org.apache.hadoop.mapreduce.YarnClient: Submitting app: {mrJobs[0]?.id}</p>
                                <p>[INFO] org.apache.hadoop.mapred.MapTask: Map split boundary: range of solar indices successfully split into {mrJobs[0]?.metrics?.hdfsBlocksLoaded || 3} blocks.</p>
                                {mrJobs[0]?.progressMap > 0 && <p>[INFO] org.apache.hadoop.mapred.TaskAttempt: Map Phase triggered on splits. Executing map() callback.</p>}
                                {mrJobs[0]?.progressMap === 100 && <p>[INFO] org.apache.hadoop.mapred.SortSpillBag: Map complete! Sorting raw solar irradiance files...</p>}
                                {mrJobs[0]?.progressReduce > 10 && <p>[INFO] org.apache.hadoop.mapred.ReduceTask: Shuffling completed! Keys partitioned. Emitting average parameters.</p>}
                                {mrJobs[0]?.progressReduce === 100 && <p>[INFO] org.apache.hadoop.mapred.FileOutputCommitter: Committing records to part-r-00000 outputs in HDFS.</p>}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[var(--border-color)] rounded-3xl text-center space-y-4">
                            <Cpu className="w-12 h-12 text-[var(--text-muted)] animate-pulse" />
                            <div>
                              <p className="text-sm font-bold text-[var(--text-primary)]">Ready to process dataset</p>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">Configure MapReduce scale and trigger job execution to compute peak analytics.</p>
                            </div>
                          </div>
                        )}

                        {/* Latest result presentation if finished */}
                        {!mrSubmitting && mrJobs[0]?.status === 'COMPLETED' && mrJobs[0]?.resultsSummary && (
                          <div className="mt-8 pt-8 border-t border-[var(--border-color)] space-y-4 animate-fade-in">
                            <h5 className="text-sm font-bold text-emerald-500 uppercase flex items-center gap-1.5 font-mono">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Job Completed Successful
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl">
                                <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] block">Calculated Peak Hour</span>
                                <span className="text-base font-bold text-[var(--text-primary)] font-mono">{mrJobs[0]?.resultsSummary?.peakHour}</span>
                              </div>
                              <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl">
                                <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] block">Computed Peak Yield</span>
                                <span className="text-base font-bold text-brand-cyan font-mono">{mrJobs[0]?.resultsSummary?.peakGeneration} kW</span>
                              </div>
                              <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl col-span-2 sm:col-span-1">
                                <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] block">Est. Carbon Saving</span>
                                <span className="text-base font-bold text-emerald-400 font-mono">{mrJobs[0]?.resultsSummary?.monthlyCarbonOffsetKg} Kg</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl">
                              <span>Output HDFS Location:</span>
                              <button 
                                onClick={() => { setMrTab('hdfs'); setHdfsPath(mrJobs[0]?.outputPath); }}
                                className="font-mono text-brand-cyan font-bold hover:underline"
                              >
                                {mrJobs[0]?.outputPath}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* History of Big Data Job Runs */}
                  <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)]">
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">YARN Job Execution History Logs</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="bg-[var(--bg-main)] border-b border-[var(--border-color)]">
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Job Identifier</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Job Name</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Input Source</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Data Blocks</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Status</th>
                            <th className="px-6 py-3 font-semibold text-[var(--text-muted)] uppercase">Completion Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/30">
                          {mrJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-[var(--bg-card)] transition-colors">
                              <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{job.id}</td>
                              <td className="px-6 py-4 text-[var(--text-secondary)]">{job.name}</td>
                              <td className="px-6 py-4 text-[var(--text-muted)]">{job.inputPath}</td>
                              <td className="px-6 py-4 text-[var(--text-muted)]">{job.metrics?.hdfsBlocksLoaded || 1} Blocks</td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-black",
                                  job.status === "COMPLETED" && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10",
                                  job.status === "RUNNING" && "bg-brand-amber/10 text-brand-amber border border-brand-amber/10 animate-pulse",
                                  job.status === "PENDING" && "bg-sky-500/10 text-sky-500 border border-sky-500/10"
                                )}>
                                  {job.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-[var(--text-muted)]">
                                {job.endTime ? new Date(job.endTime).toLocaleTimeString() : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {mrTab === 'hdfs' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* HDFS Tree navigator browser */}
                    <div className="lg:col-span-2 glass-card p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20">
                            <Folder className="w-5 h-5 text-brand-cyan" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1">
                              DFS File Explorer
                            </h4>
                            {/* Breadcrumb path */}
                            <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5 flex items-center gap-1 bg-[var(--bg-main)] px-2 py-1 rounded border border-[var(--border-color)]">
                              hdfs://192.168.10.10:9000{hdfsPath}
                            </p>
                          </div>
                        </div>

                        {/* Back navigation */}
                        {hdfsPath !== '/' && (
                          <button
                            onClick={() => {
                              const segments = hdfsPath.split('/').filter(Boolean);
                              segments.pop();
                              const parent = '/' + segments.join('/');
                              setHdfsPath(parent);
                              setSelectedHdfsFile(null);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:border-brand-cyan text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-card)] cursor-pointer transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4" /> Go Back
                          </button>
                        )}
                      </div>

                      {/* WebHDFS listed objects list */}
                      <div className="overflow-hidden border border-[var(--border-color)] rounded-2xl">
                        <table className="w-full text-left font-mono text-xs border-collapse">
                          <thead>
                            <tr className="bg-[var(--bg-main)] border-b border-[var(--border-color)]">
                              <th className="px-6 py-3 text-[var(--text-muted)] uppercase">Name</th>
                              <th className="px-6 py-3 text-[var(--text-muted)] uppercase text-center">Type</th>
                              <th className="px-6 py-3 text-[var(--text-muted)] uppercase">Permissions</th>
                              <th className="px-6 py-3 text-[var(--text-muted)] uppercase text-right">Size</th>
                              <th className="px-6 py-3 text-[var(--text-muted)] uppercase text-center">Repl</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)]/30">
                            {hdfsLoading ? (
                              <tr>
                                <td colSpan={5} className="text-center py-12 text-[var(--text-muted)] font-sans">
                                  <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                  Polling NameNode metadata block registry...
                                </td>
                              </tr>
                            ) : hdfsFiles.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="text-center py-12 text-[var(--text-muted)] font-sans">
                                  No blocks mapped to this path.
                                </td>
                              </tr>
                            ) : (
                              hdfsFiles.map((file, idx) => (
                                <tr 
                                  key={idx} 
                                  onClick={() => {
                                    if (file.type === 'DIRECTORY') {
                                      const suffix = file.pathSuffix;
                                      const nextPath = hdfsPath === '/' ? `/${suffix}` : `${hdfsPath}/${suffix}`;
                                      setHdfsPath(nextPath);
                                      setSelectedHdfsFile(null);
                                    } else {
                                      handleReadHdfsFile(file.pathSuffix);
                                    }
                                  }}
                                  className="hover:bg-[var(--bg-card)]/80 transition-colors cursor-pointer"
                                >
                                  <td className="px-6 py-4 font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    {file.type === 'DIRECTORY' ? (
                                      <Folder className="w-4 h-4 text-brand-amber text-yellow-500 fill-yellow-500/20" />
                                    ) : (
                                      <FileText className="w-4 h-4 text-brand-cyan" />
                                    )}
                                    {file.pathSuffix}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-[8px] font-black",
                                      file.type === 'DIRECTORY' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                                    )}>
                                      {file.type}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-[var(--text-muted)]">
                                    {file.type === 'DIRECTORY' ? `drwxr-xr-x` : `-rw-r--r--`}
                                  </td>
                                  <td className="px-6 py-4 text-right text-[var(--text-secondary)] font-mono">
                                    {file.type === 'DIRECTORY' ? '-' : `${(file.length / 1024).toFixed(1)} KB`}
                                  </td>
                                  <td className="px-6 py-4 text-center font-mono text-[var(--text-muted)]">
                                    {file.replication || '-'}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* File JSON Viewer panel */}
                    <div className="glass-card p-8 flex flex-col justify-between">
                      {selectedHdfsFile ? (
                        <div className="space-y-6 animate-fade-in flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4">
                              <div>
                                <h4 className="text-sm font-black font-display text-[var(--text-primary)] truncate max-w-[180px]">
                                  {selectedHdfsFile.path.split('/').pop()}
                                </h4>
                                <span className="text-[10px] text-[var(--text-muted)] block font-mono">WebHDFS: {selectedHdfsFile.node?.owner || "shaikh"} • 3x replication</span>
                              </div>
                              <button 
                                onClick={() => setSelectedHdfsFile(null)}
                                className="p-1 border border-[var(--border-color)] hover:border-rose-500 rounded-lg text-[var(--text-muted)] hover:text-rose-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="mt-4 p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl h-[330px] overflow-auto custom-scrollbar">
                              <pre className="font-mono text-[10px] text-emerald-400 whitespace-pre-wrap leading-relaxed">
                                {typeof selectedHdfsFile.content === 'object' 
                                  ? JSON.stringify(selectedHdfsFile.content, null, 2)
                                  : selectedHdfsFile.content || 'File is empty.'
                                }
                              </pre>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-[var(--border-color)] flex justify-between text-[11px] text-[var(--text-muted)] font-mono">
                            <span>Block ID: BP-42828-pimpri</span>
                            <span>Node Chunk size: {selectedHdfsFile.node?.size || 0} bytes</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[var(--border-color)] rounded-3xl text-center space-y-4 h-full my-auto">
                          <FileText className="w-12 h-12 text-[var(--text-muted)]" />
                          <div>
                            <p className="text-sm font-bold text-[var(--text-primary)]">Select HDFS File</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Click any file block on the LHS to read contents streaming directly from the selected DataNode block.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
