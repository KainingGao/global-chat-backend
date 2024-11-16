//C:\Users\kygao\global-chat-backend\src\types\index.ts

export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    location: {
      lat: number;
      lon: number;
      country: string;
      state: string;
      city: string;
    };
    tickets: number;
    lastOnline: Date;
    souvenirCollection: UserSouvenir[];  
    backpack: UserSouvenir[];
    friends: string[];
  }
  
  export interface Souvenir {
    sId: number;
    name: string;
    tier: 'd' | 'c' | 'b' | 'a' | 's';
    lat: number;
    lon: number;
    country: string;
    state: string;
    city: string;
  }
  
  export interface UserSouvenir {
    sId: number;      // Reference to original souvenir
    name: string;     // Copy of souvenir name
    tier: string;     // Copy of souvenir tier
    lat: number;      // Copy of souvenir location
    lon: number;
    country: string;
    state: string;
    city: string;
    ownerId: string;  // User who owns this instance
    giverId?: string; // User who gave this souvenir (if received through exchange)
    obtainedAt: Date; // When the souvenir was obtained
  }
  
  export interface Chat {
    _id: string;
    participants: string[];
    messages: {
      senderId: string;
      content: string;
      timestamp: Date;
    }[];
    souvenirExchanged: boolean;
  }