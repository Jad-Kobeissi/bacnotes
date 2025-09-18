import { PrismaClient } from "@/app/generated/prisma/client";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
export const prisma = new PrismaClient();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: "G-MGHF1N21HN",
};

initializeApp(firebaseConfig);

export const storage = getStorage();
