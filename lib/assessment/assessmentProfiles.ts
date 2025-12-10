import type { ReadinessProfileKey } from "./assessmentScoring";

export type ActivationContext = {
  contactName: string;
  companyName: string;
  businessType: string;
  country: string;
};

export type ReadinessProfileContent = {
  key: ReadinessProfileKey;
  emoji: string;
  colorTag: "red" | "orange" | "yellow" | "green";
  title: string;
  label: string;
  scoreBandLabel: string;
  buildSummary: (ctx: ActivationContext) => string;
  upsides: string[];
  downsides: string[];
  futureOutlook: string[];
  unlocks: string[];
  operationalPriority: string;
  primaryCtaLabel: string;
  primaryCtaDescription: string;
  secondaryCtaLabel: string;
  secondaryCtaDescription: string;
};

export const readinessProfiles: Record<ReadinessProfileKey, ReadinessProfileContent> = {
  p1_critical: {
    key: "p1_critical",
    emoji: "🟥",
    colorTag: "red",
    title: "Critical Risk Zone – High Operational Friction",
    label: "Critical Risk Zone",
    scoreBandLabel: "Total score: 0–11 out of 45",
    buildSummary: ({ contactName, companyName, businessType, country }) =>
      `${contactName}, based on your answers, ${companyName} is currently operating in a **Critical Risk Zone** for day-to-day operations. For a ${businessType} business in ${country}, this means that key flows like inventory, order management, warehousing and multi-channel sales are still highly manual, fragmented and exposed to daily risks.`,
    upsides: [
      "You are able to operate with basic tools such as spreadsheets or single systems.",
      "You can still adapt quickly because processes are not yet rigid.",
      "Decisions are often made close to the day-to-day operations."
    ],
    downsides: [
      "Low inventory accuracy typically causes lost sales, higher safety stock, and wasted time searching or correcting errors. Studies show improving inventory accuracy can increase sales by 4–8%.",
      "Stockouts are likely a recurring issue. Research indicates that more than 80% of businesses lose customers due to stockouts over time.",
      "Manual fulfillment and weak process control usually lead to slower, less predictable delivery, which reduces customer satisfaction and repeat purchases in e-commerce."
    ],
    futureOutlook: [
      "Customer churn is likely to increase due to inconsistent delivery and product availability.",
      "Scaling volume (more orders, new channels, extra warehouses) will add stress and errors faster than revenue.",
      "Management decisions will continue to rely on partial or outdated data, making planning and forecasting difficult."
    ],
    unlocks: [
      "Reducing repetitive manual warehouse tasks and error rates can improve productivity and lower labor cost per order.",
      "Real-time inventory visibility across channels reduces overselling, stockouts and emergency purchasing.",
      "Faster, more accurate fulfillment increases customer satisfaction and repeat purchases, particularly in e-commerce."
    ],
    operationalPriority: "Stabilize & Connect Basics",
    primaryCtaLabel: "Book a Stabilization & Control Workshop",
    primaryCtaDescription:
      "We map your current flows and design a 90-day plan to reduce errors and stockouts using Control 360°.",
    secondaryCtaLabel: "Try the free version of Control 360°",
    secondaryCtaDescription:
      "Start with a focused setup on inventory and order control to stabilize your core operations."
  },

  p2_fragmented: {
    key: "p2_fragmented",
    emoji: "🟧",
    colorTag: "orange",
    title: "Fragmented & Reactive – Growing but Difficult to Control",
    label: "Fragmented & Reactive",
    scoreBandLabel: "Total score: 12–22 out of 45",
    buildSummary: ({ contactName, companyName, businessType, country }) =>
      `${contactName}, ${companyName} has moved beyond a simple setup and is now dealing with visible complexity. For a ${businessType} business in ${country}, this means you have some systems and processes, but they are not yet fully integrated, which makes the operation fragmented and reactive.`,
    upsides: [
      "You already use tools for orders, inventory or warehousing.",
      "Parts of your operation run efficiently, especially when volume is stable.",
      "You can handle normal demand reasonably well."
    ],
    downsides: [
      "Data is still siloed. Manual transfers between systems increase the risk of errors and slow decisions.",
      "Inventory accuracy is 'good enough' in some areas, but inconsistencies still cause stockouts or overstock in others, affecting cash flow and margin.",
      "Fulfillment speed and reliability are variable; customers in some channels experience delays or lack of status updates."
    ],
    futureOutlook: [
      "Operational complexity will increase as order volume, channels or warehouses grow.",
      "Cost per order and error correction effort will likely rise faster than revenue.",
      "Competitors with better integrated omnichannel operations will offer more reliable availability and smoother experiences, winning repeat customers."
    ],
    unlocks: [
      "A more integrated omnichannel setup allows customers to see reliable stock, order smoothly and receive consistent updates. This is linked to higher conversion and 15–30% higher spend from omnichannel customers versus single-channel.",
      "Standardized warehouse processes and selective automation can cut error rates and handling time, improving capacity without proportional headcount growth."
    ],
    operationalPriority: "Connect & Streamline",
    primaryCtaLabel: "Schedule a Process & Integration Scan",
    primaryCtaDescription:
      "See how your tools and flows can be unified into one Control 360° environment.",
    secondaryCtaLabel: "Try the free version of Control 360°",
    secondaryCtaDescription:
      "Start working towards integrated operations with a guided configuration."
  },

  p3_structured: {
    key: "p3_structured",
    emoji: "🟨",
    colorTag: "yellow",
    title: "Structured but Under-Optimized – Strong Foundation, Untapped Potential",
    label: "Structured but Under-Optimized",
    scoreBandLabel: "Total score: 23–33 out of 45",
    buildSummary: ({ contactName, companyName, businessType, country }) =>
      `${contactName}, ${companyName} has built a solid operational foundation for a ${businessType} business in ${country}. You have defined processes, reasonable inventory control and some automation in place, but there is still significant room to improve visibility, automation depth and scalability.`,
    upsides: [
      "Many daily operations run reliably with fewer disruptions than in early-stage setups.",
      "Warehouse and distribution flows are mostly structured; staff know the procedures.",
      "Data exists for decisions, even if it is not yet fully real-time or centralized."
    ],
    downsides: [
      "Some manual steps remain in cross-system workflows, which still consume time and introduce occasional errors.",
      "Reporting may require manual consolidation from multiple tools, reducing the speed of decision-making.",
      "As volume grows or new channels/warehouses are added, current processes might struggle to keep the same service level and cost structure."
    ],
    futureOutlook: [
      "The business can keep operating, but efficiency gains will plateau.",
      "Competitors who push automation, real-time analytics and advanced inventory accuracy will gain cost and speed advantages.",
      "Opportunities for better margin, lower working capital and higher customer lifetime value may remain unused."
    ],
    unlocks: [
      "Deeper warehouse and process automation can significantly improve throughput and reduce per-order labor costs while maintaining or improving accuracy.",
      "Improving inventory record accuracy toward best-in-class levels can open 4–8% additional sales opportunity and reduce waste and write-offs.",
      "More advanced, unified analytics across channels, warehouses and customers can lead to better assortment decisions and improved profitability."
    ],
    operationalPriority: "Optimize & Scale",
    primaryCtaLabel: "Book a Scaling & Optimization Session",
    primaryCtaDescription:
      "Align your current setup with a Control 360° architecture for the next growth phase.",
    secondaryCtaLabel: "Try the free version of Control 360°",
    secondaryCtaDescription:
      "Use advanced automation and reporting features to unlock the next level of performance."
  },

  p4_integrated: {
    key: "p4_integrated",
    emoji: "🟩",
    colorTag: "green",
    title: "Integrated & Scalable – Strong Operations, Ready to Innovate",
    label: "Integrated & Scalable",
    scoreBandLabel: "Total score: 34–45 out of 45",
    buildSummary: ({ contactName, companyName, businessType, country }) =>
      `${contactName}, ${companyName} already operates with a mature, integrated setup for a ${businessType} business in ${country}. Systems, warehouses and channels are connected, processes are defined and a good level of automation is in place – putting you above industry average in several areas.`,
    upsides: [
      "Inventory, warehouse and order flows are relatively synchronized and predictable.",
      "Customers experience reliable delivery and communication, which supports satisfaction and repeat purchases.",
      "Your team has a clear structure; less time is spent firefighting and more on planned work."
    ],
    downsides: [
      "Advanced scenarios such as peak demand, complex omnichannel or new territories may still require manual intervention.",
      "You may not yet fully leverage AI-driven planning, forecasting or decision support, which more advanced players are beginning to deploy."
    ],
    futureOutlook: [
      "You are likely to remain competitive in the short term, but the gap between 'good' and 'best-in-class' will widen as more companies invest in automation, AI and integrated omnichannel experiences.",
      "This may limit your ability to capture the most profitable growth opportunities or operate with the lowest possible cost per order."
    ],
    unlocks: [
      "Applying more advanced automation and AI to forecasting, slotting, routing and staffing can further increase capacity and reduce operational cost.",
      "Deeper omnichannel integration (e.g. click-and-collect, ship-from-store, unified payments) can raise average customer spend, loyalty and lifetime value."
    ],
    operationalPriority: "Innovate & Differentiate",
    primaryCtaLabel: "Book a Control 360° Innovation Session",
    primaryCtaDescription:
      "Explore AI-powered automation and advanced omnichannel flows on top of your existing structure.",
    secondaryCtaLabel: "Try the free version of Control 360°",
    secondaryCtaDescription:
      "Use Control 360° as your central layer to move from strong to best-in-class operations."
  }
};

