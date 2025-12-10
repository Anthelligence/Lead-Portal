// 5 dimensions, based on sections
export type Dimension =
  | "inventory_visibility" // Section 1
  | "order_fulfillment" // Section 2
  | "warehouse_operations" // Section 3
  | "multichannel_integration" // Section 4
  | "automation_scalability"; // Section 5

// Internal stored value 0–3 (mapped from UI 1–4)
export type AnswerValue = 0 | 1 | 2 | 3;

export type AnswerOption = {
  id: string;
  label: string;
  value: AnswerValue;
};

export type Question = {
  id: string;
  section: 1 | 2 | 3 | 4 | 5;
  dimension: Dimension;
  text: string;
  options: AnswerOption[];
};

// questionId -> selected answer value (0–3)
export type AnswersMap = Record<string, AnswerValue>;

export const questions: Question[] = [
  // SECTION 1 — Inventory Visibility & SKU Management
  {
    id: "q1",
    section: 1,
    dimension: "inventory_visibility",
    text: "How do you currently track stock levels across all channels/locations?",
    options: [
      { id: "q1o1", label: "Fully manual (spreadsheets, paper)", value: 0 },
      { id: "q1o2", label: "Semi-manual (tool + manual adjustments)", value: 1 },
      { id: "q1o3", label: "Mostly automated (one system, some gaps)", value: 2 },
      {
        id: "q1o4",
        label: "Fully automated, real-time sync across all channels",
        value: 3
      }
    ]
  },
  {
    id: "q2",
    section: 1,
    dimension: "inventory_visibility",
    text: "How accurate is your inventory count at any given time?",
    options: [
      { id: "q2o1", label: "Often inaccurate", value: 0 },
      { id: "q2o2", label: "Sometimes inaccurate", value: 1 },
      { id: "q2o3", label: "Mostly accurate", value: 2 },
      { id: "q2o4", label: "Consistently accurate", value: 3 }
    ]
  },
  {
    id: "q3",
    section: 1,
    dimension: "inventory_visibility",
    text: "How easy is it to check stock availability across warehouses, stores, or fulfillment partners?",
    options: [
      { id: "q3o1", label: "Very difficult / unclear", value: 0 },
      { id: "q3o2", label: "Possible, but takes effort or manual checks", value: 1 },
      { id: "q3o3", label: "Mostly clear", value: 2 },
      { id: "q3o4", label: "Fully visible in one central place", value: 3 }
    ]
  },

  // SECTION 2 — Order Management & Fulfillment
  {
    id: "q4",
    section: 2,
    dimension: "order_fulfillment",
    text: "How are B2B or B2C orders processed today?",
    options: [
      { id: "q4o1", label: "Manual picking, packing, and updating", value: 0 },
      { id: "q4o2", label: "Some automation, but still manual steps", value: 1 },
      {
        id: "q4o3",
        label: "Mostly automated with structured workflows",
        value: 2
      },
      {
        id: "q4o4",
        label: "Fully automated with clear routing and updates",
        value: 3
      }
    ]
  },
  {
    id: "q5",
    section: 2,
    dimension: "order_fulfillment",
    text: "How often do order errors occur (wrong item, wrong qty, wrong location, missing scan)?",
    options: [
      { id: "q5o1", label: "Very often", value: 0 },
      { id: "q5o2", label: "Occasionally", value: 1 },
      { id: "q5o3", label: "Rarely", value: 2 },
      { id: "q5o4", label: "Almost never", value: 3 }
    ]
  },
  {
    id: "q6",
    section: 2,
    dimension: "order_fulfillment",
    text: "How consistent is your order fulfillment speed?",
    options: [
      { id: "q6o1", label: "Highly inconsistent or slow", value: 0 },
      { id: "q6o2", label: "Moderate, depends on workload", value: 1 },
      { id: "q6o3", label: "Generally fast", value: 2 },
      { id: "q6o4", label: "Very fast and stable", value: 3 }
    ]
  },

  // SECTION 3 — Warehouse Operations & Internal Processes
  {
    id: "q7",
    section: 3,
    dimension: "warehouse_operations",
    text: "How organized and efficient are your warehouse operations?",
    options: [
      { id: "q7o1", label: "Unstructured / manual / hard to track", value: 0 },
      { id: "q7o2", label: "Some processes exist but not standardized", value: 1 },
      { id: "q7o3", label: "Well structured with clear workflows", value: 2 },
      {
        id: "q7o4",
        label: "Highly optimized with clear zones & automation",
        value: 3
      }
    ]
  },
  {
    id: "q8",
    section: 3,
    dimension: "warehouse_operations",
    text: "How well does your team follow scanning, picking, packing, and movement procedures?",
    options: [
      { id: "q8o1", label: "No consistent process", value: 0 },
      { id: "q8o2", label: "Some adherence, but gaps", value: 1 },
      { id: "q8o3", label: "Mostly consistent", value: 2 },
      { id: "q8o4", label: "Fully consistent & trackable", value: 3 }
    ]
  },
  {
    id: "q9",
    section: 3,
    dimension: "warehouse_operations",
    text: "How often do you experience delays or bottlenecks due to manual tasks inside the warehouse?",
    options: [
      { id: "q9o1", label: "Daily", value: 0 },
      { id: "q9o2", label: "Weekly", value: 1 },
      { id: "q9o3", label: "Monthly", value: 2 },
      { id: "q9o4", label: "Rarely", value: 3 }
    ]
  },

  // SECTION 4 — Multi-Channel & Systems Integration
  {
    id: "q10",
    section: 4,
    dimension: "multichannel_integration",
    text: "How many systems/tools are used to manage sales, stock, orders, and customers?",
    options: [
      { id: "q10o1", label: "5+ disconnected systems", value: 0 },
      { id: "q10o2", label: "3–4 systems, partially connected", value: 1 },
      { id: "q10o3", label: "1–2 systems, mostly connected", value: 2 },
      { id: "q10o4", label: "1 fully integrated environment", value: 3 }
    ]
  },
  {
    id: "q11",
    section: 4,
    dimension: "multichannel_integration",
    text: "How well do your systems synchronize orders, inventory, customer data, and reporting?",
    options: [
      { id: "q11o1", label: "Not synchronized", value: 0 },
      { id: "q11o2", label: "Partially synchronized", value: 1 },
      { id: "q11o3", label: "Mostly synchronized", value: 2 },
      { id: "q11o4", label: "Fully synchronized real-time", value: 3 }
    ]
  },
  {
    id: "q12",
    section: 4,
    dimension: "multichannel_integration",
    text: "How often do you manually transfer data (copy/paste, exports, spreadsheets)?",
    options: [
      { id: "q12o1", label: "Constantly", value: 0 },
      { id: "q12o2", label: "Often", value: 1 },
      { id: "q12o3", label: "Sometimes", value: 2 },
      { id: "q12o4", label: "Rarely / never", value: 3 }
    ]
  },

  // SECTION 5 — Automation, Planning & Scalability
  {
    id: "q13",
    section: 5,
    dimension: "automation_scalability",
    text: "How many operational processes are currently automated?",
    options: [
      { id: "q13o1", label: "None", value: 0 },
      { id: "q13o2", label: "Some", value: 1 },
      { id: "q13o3", label: "Many", value: 2 },
      { id: "q13o4", label: "Most / nearly all", value: 3 }
    ]
  },
  {
    id: "q14",
    section: 5,
    dimension: "automation_scalability",
    text: "How do you handle reporting and operational decision-making?",
    options: [
      { id: "q14o1", label: "Manual reports, no central view", value: 0 },
      { id: "q14o2", label: "Basic reports, not real-time", value: 1 },
      { id: "q14o3", label: "Good dashboards, partly connected", value: 2 },
      {
        id: "q14o4",
        label: "Real-time automated dashboards for all key flows",
        value: 3
      }
    ]
  },
  {
    id: "q15",
    section: 5,
    dimension: "automation_scalability",
    text: "How prepared is your business to scale (double order volume, more warehouses, new channels)?",
    options: [
      { id: "q15o1", label: "Not prepared", value: 0 },
      { id: "q15o2", label: "Somewhat prepared", value: 1 },
      { id: "q15o3", label: "Mostly prepared", value: 2 },
      { id: "q15o4", label: "Fully prepared", value: 3 }
    ]
  }
];

