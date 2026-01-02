// /src/infra/firebase/dto/UserDocV1.ts

export type UserDocV1 = {
    schemaVersion: 1;
    uid: string;
  
    createdAt: number;
    lastSeenAt?: number;
  
    email?: string;
    displayName?: string;
    photoURL?: string;
  };
      