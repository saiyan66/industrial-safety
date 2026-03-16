
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

console.log("ENV DB_USER:", process.env.DB_USER);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
})