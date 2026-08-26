import mongoose from "mongoose";
import dns from "dns";

// A stale, disconnected VPN adapter can leave dead DNS servers configured
// in Windows; Node's resolver may pick those instead of the active
// adapter's, breaking the mongodb+srv:// SRV lookup. Force known-good
// resolvers so the srv lookup doesn't depend on adapter state.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error.message)
    process.exit(1);
  }
};

export default connectDB;
