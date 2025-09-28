import type { RailwayComponent, User, ComponentState } from '@/lib/types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@railtracer.com',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin@railtracer.com',
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@railtracer.com',
    role: 'staff',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff@railtracer.com',
  },
];

const generateHistory = (componentId: string, baseStatus: ComponentState) => {
  const statuses: ComponentState[] = ['Verified', 'Unverified', 'Damaged'];
  const history: RailwayComponent['history'] = [];
  const numInspections = Math.floor(Math.random() * 5) + 2;

  let currentDate = new Date();
  let currentStatus = baseStatus;

  for (let i = 0; i < numInspections; i++) {
    currentDate.setMonth(currentDate.getMonth() - (Math.floor(Math.random() * 3) + 1));
    const inspector = users[Math.floor(Math.random() * users.length)];
    
    if (i > 0) {
      if (history[i-1].status === 'Damaged') {
        currentStatus = 'Verified'; 
      } else {
        currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
      }
    }

    history.push({
      id: `${componentId}-h${i}`,
      date: currentDate.toISOString().split('T')[0],
      inspector: inspector.name,
      inspectorId: inspector.id,
      notes: `Inspection ${i + 1}. Status set to ${currentStatus}. All systems checked. ${i % 2 === 0 ? 'Minor adjustments made.' : 'No issues found.'}`,
      status: currentStatus,
    });
  }
  return history.reverse();
};

export const components: RailwayComponent[] = [
  {
    id: 'WC-582-A',
    name: 'Wheelset Assembly A',
    type: 'Wheelset',
    qrCode: 'https://railtracer.com/components/WC-582-A',
    location: 'Yard 3, Track 7',
    installDate: '2022-01-15',
    currentState: 'Verified',
    history: [],
    vendor: 'RailTech Corp',
    warrantyUntil: '2032-01-15',
    supplyDate: '2021-12-20',
  },
  {
    id: 'BK-101-C',
    name: 'Brake Caliper C',
    type: 'Braking System',
    qrCode: 'https://railtracer.com/components/BK-101-C',
    location: 'Maintenance Bay 1',
    installDate: '2021-11-20',
    currentState: 'Unverified',
    history: [],
    vendor: 'Durable Brakes Inc.',
    warrantyUntil: '2026-11-20',
    supplyDate: '2021-10-15',
  },
  {
    id: 'AXL-99B-F',
    name: 'Axle Bearing F',
    type: 'Axle',
    qrCode: 'https://railtracer.com/components/AXL-99B-F',
    location: 'Locomotive 734',
    installDate: '2023-03-10',
    currentState: 'Damaged',
    history: [],
    vendor: 'Axle & Wheel Co.',
    warrantyUntil: '2028-03-10',
    supplyDate: '2023-02-01',
  },
  {
    id: 'CPL-45D-R',
    name: 'Coupler Unit R',
    type: 'Coupler',
    qrCode: 'https://railtracer.com/components/CPL-45D-R',
    location: 'Car 8122',
    installDate: '2020-07-22',
    currentState: 'Verified',
    history: [],
    vendor: 'Secure Couplings Ltd.',
    warrantyUntil: '2025-07-22',
    supplyDate: '2020-06-11',
  },
  {
    id: 'SUS-P14-E',
    name: 'Suspension Spring E',
    type: 'Suspension',
    qrCode: 'https://railtracer.com/components/SUS-P14-E',
    location: 'Car 8122',
    installDate: '2022-08-01',
    currentState: 'Unverified',
    history: [],
    vendor: 'SpringMasters',
    warrantyUntil: '2027-08-01',
    supplyDate: '2022-07-15',
  },
    {
    id: 'HVAC-007-B',
    name: 'HVAC Unit B',
    type: 'HVAC',
    qrCode: 'https://railtracer.com/components/HVAC-007-B',
    location: 'Passenger Car 3',
    installDate: '2023-05-19',
    currentState: 'Verified',
    history: [],
    vendor: 'ClimateRail',
    warrantyUntil: '2028-05-19',
    supplyDate: '2023-04-22',
  },
  {
    id: 'ERC-33A-1',
    name: 'Elastic Rail Clip 1',
    type: 'Elastic Rail Clip',
    qrCode: 'https://railtracer.com/components/ERC-33A-1',
    location: 'Section 5, North Line',
    installDate: '2023-01-20',
    currentState: 'Verified',
    history: [],
    vendor: 'FastenRight',
    warrantyUntil: '2033-01-20',
    supplyDate: '2022-12-10',
  },
  {
    id: 'RP-B2-12',
    name: 'Rail Pad 12',
    type: 'Rail Pad',
    qrCode: 'https://railtracer.com/components/RP-B2-12',
    location: 'Section 5, North Line',
    installDate: '2023-01-20',
    currentState: 'Verified',
    history: [],
    vendor: 'PadWorks',
    warrantyUntil: '2028-01-20',
    supplyDate: '2022-12-10',
  },
  {
    id: 'LNR-S1-45',
    name: 'Liner 45',
    type: 'Liner',
    qrCode: 'https://railtracer.com/components/LNR-S1-45',
    location: 'Section 5, North Line',
    installDate: '2023-01-20',
    currentState: 'Unverified',
    history: [],
    vendor: 'TrackLiners Inc.',
    warrantyUntil: '2030-01-20',
    supplyDate: '2022-12-10',
  },
  {
    id: 'SLP-C9-8',
    name: 'Sleeper 8',
    type: 'Sleeper',
    qrCode: 'https://railtracer.com/components/SLP-C9-8',
    location: 'Section 5, North Line',
    installDate: '2023-01-20',
    currentState: 'Damaged',
    history: [],
    vendor: 'DuraSleepers',
    warrantyUntil: '2043-01-20',
    supplyDate: '2022-12-10',
  },
];

components.forEach(comp => {
  comp.history = generateHistory(comp.id, comp.currentState);
  if (comp.history.length > 0) {
    comp.currentState = comp.history[0].status;
  }
});

export const getComponentById = (id: string): RailwayComponent | undefined => {
  return components.find(c => c.id === id);
}

export const getComponents = (): RailwayComponent[] => {
  return components;
}

export const getUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
}

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(u => u.email === email);
}
