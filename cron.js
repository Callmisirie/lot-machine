const axios = require("axios");
const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  console.log("Triggering API...");
  try {
    const response = await axios.post("http://localhost:3000/api/updateSubscriptions");
    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error calling API:", error.message);
  }
});
