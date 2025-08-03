// backend/server.js
import app from "./app.js";
import cors from "cors";

app.use(cors({ origin: "http://localhost:5173" }));


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
