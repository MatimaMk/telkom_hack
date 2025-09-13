export interface TelkomUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plan: string;
  accountNumber: string;
  registeredAt: string;
  password?: string;
}

export interface TelkomUsageData {
  dataUsed: number;
  dataAllowance: number;
  currentBill: number;
  billDueDate: string;
  connectionSpeed: number;
  planStatus: 'active' | 'suspended' | 'expired';
}

export interface TelkomActivity {
  id: string;
  type: 'data' | 'call' | 'payment' | 'system';
  description: string;
  timestamp: string;
  value: string;
}

export interface TelkomScrapedData {
  usage: TelkomUsageData;
  activities: TelkomActivity[];
  lastUpdated: string;
}

const TELKOM_USERS_STORAGE_KEY = 'telkom_users_db';
const TELKOM_DATA_STORAGE_KEY = 'telkom_scraped_data';

export class TelkomDataService {
  private static users: TelkomUser[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+27123456789',
      plan: 'Fiber Premium 100Mbps',
      accountNumber: 'TLK001234567',
      registeredAt: new Date().toISOString(),
      password: 'password123'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+27987654321',
      plan: 'Mobile Data 50GB',
      accountNumber: 'TLK007654321',
      registeredAt: new Date().toISOString(),
      password: 'password456'
    }
  ];

  static async authenticateUser(email: string, password: string): Promise<TelkomUser | null> {
    try {
      const users = this.loadUsersFromStorage();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  static async getUserById(id: number): Promise<TelkomUser | null> {
    try {
      const users = this.loadUsersFromStorage();
      const user = users.find(u => u.id === id);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  static async getUserByAccountNumber(accountNumber: string): Promise<TelkomUser | null> {
    try {
      const users = this.loadUsersFromStorage();
      const user = users.find(u => u.accountNumber === accountNumber);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      return null;
    } catch (error) {
      console.error('Get user by account error:', error);
      return null;
    }
  }

  static async getScrapedData(accountNumber: string): Promise<TelkomScrapedData | null> {
    try {
      const data = this.loadScrapedDataFromStorage();
      return data[accountNumber] || null;
    } catch (error) {
      console.error('Get scraped data error:', error);
      return null;
    }
  }

  static async saveScrapedData(accountNumber: string, data: TelkomScrapedData): Promise<void> {
    try {
      const existingData = this.loadScrapedDataFromStorage();
      existingData[accountNumber] = {
        ...data,
        lastUpdated: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(TELKOM_DATA_STORAGE_KEY, JSON.stringify(existingData));
      }
    } catch (error) {
      console.error('Save scraped data error:', error);
      throw error;
    }
  }

  static generateMockUsageData(plan: string): TelkomUsageData {
    const planConfigs: { [key: string]: Partial<TelkomUsageData> } = {
      'Fiber Premium 100Mbps': {
        dataAllowance: 100000, // 100GB in MB
        connectionSpeed: 100,
        currentBill: 299.00
      },
      'Mobile Data 50GB': {
        dataAllowance: 50000, // 50GB in MB
        connectionSpeed: 50,
        currentBill: 199.00
      }
    };

    const config = planConfigs[plan] || {
      dataAllowance: 10000,
      connectionSpeed: 20,
      currentBill: 99.00
    };

    return {
      dataUsed: Math.floor(Math.random() * (config.dataAllowance! * 0.8)), // Random usage up to 80%
      dataAllowance: config.dataAllowance!,
      currentBill: config.currentBill!,
      billDueDate: this.getNextMonthDate(),
      connectionSpeed: config.connectionSpeed!,
      planStatus: 'active'
    };
  }

  static generateMockActivities(): TelkomActivity[] {
    const activities: TelkomActivity[] = [
      {
        id: '1',
        type: 'data',
        description: 'Data usage spike detected',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        value: '2.3 GB'
      },
      {
        id: '2',
        type: 'call',
        description: 'Voice call - Premium rate',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        value: '45 min'
      },
      {
        id: '3',
        type: 'payment',
        description: 'Bill payment received',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        value: 'R299'
      },
      {
        id: '4',
        type: 'system',
        description: 'Plan upgraded successfully',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        value: 'Premium'
      }
    ];

    return activities;
  }

  private static loadUsersFromStorage(): TelkomUser[] {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(TELKOM_USERS_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }

      // Save default users to storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(TELKOM_USERS_STORAGE_KEY, JSON.stringify(this.users));
      }

      return this.users;
    } catch (error) {
      console.error('Load users from storage error:', error);
      return this.users;
    }
  }

  private static loadScrapedDataFromStorage(): { [accountNumber: string]: TelkomScrapedData } {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(TELKOM_DATA_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
      return {};
    } catch (error) {
      console.error('Load scraped data from storage error:', error);
      return {};
    }
  }

  private static getNextMonthDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(25); // Bill due on 25th
    return date.toISOString().split('T')[0];
  }

  static async refreshUserData(accountNumber: string): Promise<TelkomScrapedData> {
    const user = await this.getUserByAccountNumber(accountNumber);
    if (!user) {
      throw new Error('User not found');
    }

    const mockData: TelkomScrapedData = {
      usage: this.generateMockUsageData(user.plan),
      activities: this.generateMockActivities(),
      lastUpdated: new Date().toISOString()
    };

    await this.saveScrapedData(accountNumber, mockData);
    return mockData;
  }
}

export default TelkomDataService;