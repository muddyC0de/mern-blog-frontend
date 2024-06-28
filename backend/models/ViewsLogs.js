import mongoose from "mongoose";

const ViewsLogsSchema = new mongoose.Schema({
  log: {
    type: String,
  },
});

export default mongoose.model("ViewsLogs", ViewsLogsSchema);
