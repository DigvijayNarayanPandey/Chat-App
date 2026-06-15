import mongoose from "mongoose";
import { ENV } from "./env.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB Connected😉");
  } catch (error) {
    console.error("Error connection to MONGODB 😒", error);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};
