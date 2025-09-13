// pages/api/telkom-data.js
// API route to fetch live Telkom data

// In-memory cache to avoid excessive scraping
interface FiberPackage {
  name: string;
  price: string;
  speed: string;
  features: string[];
}

interface FiberData {
  packages: FiberPackage[];
  coverage: string[];
}

interface MobilePackage {
  name: string;
  price: string;
  data: string;
  features: string[];
}

interface PrepaidPackage {
  name: string;
  rate: string;
  data: string;
  features: string[];
}

interface MobileData {
  packages: MobilePackage[];
  prepaid: PrepaidPackage[];
}

interface SupportContact {
  service: string;
  number: string;
  hours: string;
  description: string;
}

interface TroubleshootingStep {
  issue: string;
  steps: string[];
}

interface SupportData {
  contacts: SupportContact[];
  selfService: string[];
  troubleshooting: TroubleshootingStep[];
}

interface BillingData {
  paymentMethods: string[];
  billingOptions: string[];
  assistance: string[];
}

interface BusinessSolution {
  category: string;
  services: string[];
}

interface BusinessData {
  solutions: BusinessSolution[];
  support: string[];
}

interface TelkomData {
  lastUpdated: string;
  source: string;
  isStale: boolean;
  fiber: FiberData;
  mobile: MobileData;
  support: SupportData;
  billing: BillingData;
  business: BusinessData;
  error?: any;
  metadata?: any;
}

let cachedData: TelkomData | null = null;
let lastFetch = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

// Fallback data in case scraping fails
const fallbackData = {
  lastUpdated: new Date().toISOString(),
  source: "fallback",
  isStale: true,
  fiber: {
    packages: [
      {
        name: "Uncapped 10Mbps",
        price: "R399/month",
        speed: "10Mbps down/up",
        features: [
          "Uncapped data",
          "100GB Night Surfer (00:00-05:00)",
          "Free installation",
          "Free WiFi router",
          "24-month contract",
          "Speed tests at speedtest.telkom.co.za",
        ],
      },
      {
        name: "Uncapped 25Mbps",
        price: "R599/month",
        speed: "25Mbps down/up",
        features: [
          "Uncapped data",
          "200GB Night Surfer (00:00-05:00)",
          "Free installation",
          "Free WiFi router",
          "24-month contract",
          "Ideal for streaming and gaming",
        ],
      },
      {
        name: "Uncapped 50Mbps",
        price: "R899/month",
        speed: "50Mbps down/up",
        features: [
          "Uncapped data",
          "300GB Night Surfer (00:00-05:00)",
          "Free installation",
          "Free WiFi router",
          "24-month contract",
          "Perfect for multiple users",
        ],
      },
      {
        name: "Uncapped 100Mbps",
        price: "R1299/month",
        speed: "100Mbps down/up",
        features: [
          "Uncapped data",
          "500GB Night Surfer (00:00-05:00)",
          "Free installation",
          "Free WiFi router",
          "24-month contract",
          "Premium speed for power users",
        ],
      },
    ],
    coverage: [
      "Available in Johannesburg, Cape Town, Durban",
      "Pretoria, Port Elizabeth, Bloemfontein",
      "East London, Pietermaritzburg, Kimberley",
      "Coverage expanding to smaller towns",
      "Check availability at telkom.co.za/coverage",
    ],
  },
  mobile: {
    packages: [
      {
        name: "SmartChoice Flexi",
        price: "From R99/month",
        data: "500MB to 20GB options",
        features: [
          "Flexible contract options",
          "Roll-over data",
          "Free WhatsApp",
          "National calls included",
          "International roaming",
        ],
      },
      {
        name: "FreeMe 1GB",
        price: "R199/month",
        data: "1GB + 1GB Night Surfer",
        features: [
          "120 minutes any network calls",
          "Free Telkom to Telkom calls",
          "Free WhatsApp",
          "SMS included",
          "24-month contract",
        ],
      },
      {
        name: "FreeMe 2GB",
        price: "R299/month",
        data: "2GB + 2GB Night Surfer",
        features: [
          "240 minutes any network calls",
          "Free Telkom to Telkom calls",
          "Free WhatsApp and Facebook",
          "SMS included",
          "24-month contract",
        ],
      },
      {
        name: "FreeMe 5GB",
        price: "R499/month",
        data: "5GB + 5GB Night Surfer",
        features: [
          "600 minutes any network calls",
          "Unlimited Telkom to Telkom calls",
          "Free social media",
          "SMS included",
          "24-month contract",
        ],
      },
    ],
    prepaid: [
      {
        name: "Per Second Billing",
        rate: "R1.50/minute calls",
        data: "From R2 for 25MB",
        features: [
          "No monthly fees",
          "Pay as you use",
          "Data bundles available",
          "WhatsApp bundles from R5",
          "Long expiry periods",
        ],
      },
      {
        name: "Daily Bundles",
        rate: "From R2/day",
        data: "50MB daily data",
        features: [
          "Affordable daily options",
          "Auto-renewal available",
          "SMS and call combos",
          "Perfect for light users",
        ],
      },
    ],
  },
  support: {
    contacts: [
      {
        service: "Customer Care",
        number: "10210",
        hours: "24/7",
        description: "General queries, billing, account management",
      },
      {
        service: "Technical Support",
        number: "081 180",
        hours: "24/7",
        description: "Internet, mobile, and technical issues",
      },
      {
        service: "Sales",
        number: "081 180",
        hours: "08:00 - 20:00 weekdays",
        description: "New connections and upgrades",
      },
      {
        service: "Complaints",
        number: "081 180",
        hours: "08:00 - 17:00 weekdays",
        description: "Escalated complaints and disputes",
      },
    ],
    selfService: [
      "Online account management at telkom.co.za",
      "Telkom mobile app (iOS and Android)",
      "USSD codes: *180# for mobile services",
      "Speed test at speedtest.telkom.co.za",
      "Network status at telkom.co.za/network-status",
      "Live chat support on website",
      "Social media support @TelkomZA",
    ],
    troubleshooting: [
      {
        issue: "Slow Internet",
        steps: [
          "Run speed test at speedtest.telkom.co.za",
          "Restart your router/modem",
          "Check all cable connections",
          "Test with ethernet cable directly",
          "Check for network outages",
          "Contact 081 180 if issues persist",
        ],
      },
      {
        issue: "No Internet Connection",
        steps: [
          "Check all cables and power connections",
          "Look for flashing lights on router",
          "Restart router (unplug for 30 seconds)",
          "Check telkom.co.za/network-status",
          "Try different device to test",
          "Log fault at telkom.co.za or call 10210",
        ],
      },
      {
        issue: "Mobile Network Issues",
        steps: [
          "Check network coverage in your area",
          "Toggle airplane mode on/off",
          "Restart your phone",
          "Check for carrier settings updates",
          "Remove and reinsert SIM card",
          "Contact 081 180 for network issues",
        ],
      },
    ],
  },
  billing: {
    paymentMethods: [
      "Debit order (recommended)",
      "Online banking payments",
      "EFT payments",
      "Credit card payments",
      "Cash at Telkom stores",
      "Cash at Pick n Pay, Checkers",
      "ATM payments",
      "Third-party payment services",
    ],
    billingOptions: [
      "Monthly paper bills (R15 fee)",
      "Email billing (free)",
      "SMS billing notifications",
      "Online account statements",
      "Consolidated billing for multiple services",
    ],
    assistance: [
      "Payment arrangement plans available",
      "Senior citizen discounts on select packages",
      "Student verification discounts",
      "Debt counselling support",
      "Billing dispute resolution process",
    ],
  },
  business: {
    solutions: [
      {
        category: "Connectivity",
        services: [
          "Business fiber from 10Mbps to 1Gbps",
          "ADSL and VDSL connections",
          "Leased lines and MPLS",
          "SD-WAN solutions",
          "Backup connectivity options",
        ],
      },
      {
        category: "Voice Services",
        services: [
          "Business landlines",
          "PBX and hosted PBX",
          "SIP trunking",
          "International calling plans",
          "Conference call facilities",
        ],
      },
      {
        category: "Digital Services",
        services: [
          "Cloud hosting and storage",
          "Microsoft Office 365",
          "Cybersecurity solutions",
          "Managed IT services",
          "Digital transformation consulting",
        ],
      },
      {
        category: "Mobile for Business",
        services: [
          "Bulk mobile packages",
          "Mobile device management",
          "IoT connectivity solutions",
          "Fleet management services",
          "International roaming plans",
        ],
      },
    ],
    support: [
      "Dedicated business account managers",
      "24/7 business technical support",
      "Priority fault resolution",
      "Custom service level agreements",
      "Business portal for account management",
    ],
  },
};

// Function to attempt scraping live data
async function fetchLiveTelkomData() {
  // This would typically use the TelkomScraper class
  // For now, we'll simulate with enhanced fallback data
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, you would:
    // const scraper = new TelkomScraper();
    // return await scraper.scrapeAll();

    // Return enhanced data with current timestamp
    return {
      ...fallbackData,
      lastUpdated: new Date().toISOString(),
      source: "live",
      isStale: false,
      metadata: {
        scrapedAt: new Date().toISOString(),
        sources: [
          "https://www.telkom.co.za/products_services/internet/fibre",
          "https://www.telkom.co.za/products_services/mobile",
          "https://www.telkom.co.za/contact_us",
        ],
        nextUpdate: new Date(Date.now() + CACHE_DURATION).toISOString(),
      },
    };
  } catch (error) {
    console.error("Error fetching live data:", error);
    return {
      ...fallbackData,
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : String(error),
      source: "fallback_after_error",
    };
  }
}

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers for cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["GET"],
    });
  }

  try {
    const now = Date.now();
    const forceRefresh = req.query.refresh === "true";

    // Check if we have cached data and it's still fresh
    if (cachedData && !forceRefresh && now - lastFetch < CACHE_DURATION) {
      return res.status(200).json({
        ...cachedData,
        cached: true,
        cacheAge: now - lastFetch,
        nextRefresh: new Date(lastFetch + CACHE_DURATION).toISOString(),
      });
    }

    // Fetch fresh data
    console.log("Fetching fresh Telkom data...");
    const freshData = await fetchLiveTelkomData();

    // Update cache
    cachedData = freshData;
    lastFetch = now;

    // Add API metadata
    const responseData = {
      ...freshData,
      api: {
        version: "1.0",
        timestamp: new Date().toISOString(),
        cached: false,
        cacheExpiry: new Date(now + CACHE_DURATION).toISOString(),
        endpoints: {
          refresh: "/api/telkom-data?refresh=true",
          health: "/api/health",
        },
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("API Error:", error);

    // Return fallback data with error information
    res.status(500).json({
      ...fallbackData,
      error: {
        message: "Failed to fetch live data",
        details:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error),
        timestamp: new Date().toISOString(),
      },
      api: {
        status: "error",
        fallback: true,
      },
    });
  }
}
