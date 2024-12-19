// ServerLocations.js

export const serverLocations = {
    // North America
    "us-west-1": {
        city: "San Francisco",
        lat: 350.0,
        lng: 250.0,  // Adjusted for better west coast position
        region: "North America",
        tier: "primary",
        redundancy: ["us-west-2", "us-east-1"],
        status: "active"
      },
      "us-west-2": {
        city: "Seattle",
        lat: 380.0,
        lng: 200.0,  // Much further north
        region: "North America", 
        tier: "secondary",
        redundancy: ["us-west-1"],
        status: "active"
      },
      "us-central": {
        city: "Chicago",
        lat: 500.0,  // Adjusted relative spacing
        lng: 220.0,
        region: "North America",
        tier: "secondary",
        redundancy: ["us-east-1", "us-west-1"],
        status: "active"
      },
      "us-east-1": {
        city: "New York",
        lat: 620.0,  // Adjusted east coast position
        lng: 230.0,
        region: "North America",
        tier: "primary",
        redundancy: ["us-east-2", "us-central"],
        status: "active"
      },
      "us-east-2": {
        city: "Virginia",
        lat: 560.0,  // Better spacing from NY
        lng: 260.0,
        region: "North America",
        tier: "secondary",
        redundancy: ["us-east-1"],
        status: "active"
      },
    
    // Europe - keeping most European coordinates as they looked good
    "eu-central-1": {
      city: "Frankfurt",
      lat: 1070.6,
      lng: 190.8,
      region: "Europe",
      tier: "primary",
      redundancy: ["eu-west-1", "eu-central-2"],
      status: "active"
    },
    "eu-central-2": {
      city: "Prague",
      lat: 1059.7,
      lng: 175.2,
      region: "Europe",
      tier: "secondary",
      redundancy: ["eu-central-1"],
      status: "active"
    },
    "eu-west-1": {
      city: "London",
      lat: 980.0,
      lng: 158.2,
      region: "Europe",
      tier: "primary",
      redundancy: ["eu-central-1", "eu-west-2"],
      status: "active"
    },
    "eu-west-2": {
      city: "Paris",
      lat: 1016.5,
      lng: 177.1,
      region: "Europe",
      tier: "secondary",
      redundancy: ["eu-west-1"],
      status: "active"
    },
    "eu-north-1": {
      city: "Stockholm",
      lat: 1088.2,
      lng: 87.0,
      region: "Europe",
      tier: "secondary",
      redundancy: ["eu-central-1"],
      status: "active"
    },
  
    // Asia Pacific
    "ap-northeast-1": {
      city: "Tokyo",
      lat: 1722.9,
      lng: 259.5,
      region: "Asia Pacific",
      tier: "primary",
      redundancy: ["ap-northeast-2"],
      status: "active"
    },
    "ap-northeast-2": {
      city: "Seoul",
      lat: 1660.3,
      lng: 229.9,
      region: "Asia Pacific",
      tier: "secondary",
      redundancy: ["ap-northeast-1"],
      status: "active"
    },
    "ap-southeast-1": {
      city: "Singapore",
      lat: 1580.0,  // Moved east
      lng: 480.0,   // Moved up
      region: "Asia Pacific",
      tier: "primary",
      redundancy: ["ap-southeast-2"],
      status: "active"
    },
    "ap-southeast-2": {
      city: "Sydney",
      lat: 1800.0,  // Moved west
      lng: 700.0,   // Adjusted south
      region: "Asia Pacific",
      tier: "secondary",
      redundancy: ["ap-southeast-1"],
      status: "active"
    },
  
    // South America
    "sa-east-1": {
      city: "São Paulo",
      lat: 750.0,
      lng: 550.0,  // Moved south
      region: "South America",
      tier: "primary",
      redundancy: ["sa-east-2"],
      status: "active"
    },
    "sa-east-2": {
      city: "Rio de Janeiro",
      lat: 670.0,  // Slightly east of São Paulo
      lng: 560.0,  // Slightly south
      region: "South America",
      tier: "secondary",
      redundancy: ["sa-east-1"],
      status: "active"
    }
};
  
// Helper function to get server by region
export const getServersByRegion = (region) => {
  return Object.entries(serverLocations).filter(([_, data]) => data.region === region);
};
  
// Helper function to get nearest redundant server
export const getNearestRedundantServer = (serverId) => {
  const server = serverLocations[serverId];
  if (!server?.redundancy?.length) return null;
  return server.redundancy[0];
};

export default serverLocations;