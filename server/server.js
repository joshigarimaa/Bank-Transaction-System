const app = require("./src/index");
const connectDB = require("./src/config/db");
require("dotenv").config();

connectDB();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Heyy");
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});