import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/check", async (req, res) => {
  const urls = req.body.urls.slice(0, 10); // max 10 URLs
  const results = [];

  for (let url of urls) {
    try {
      if (!url.startsWith("http")) url = "https://" + url;
      const response = await axios.get(url, { timeout: 5000 });
      if (response.status < 400) {
        results.push({ url, status: "Not Blocked" });
      } else {
        results.push({ url, status: "Blocked" });
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        results.push({ url, status: "May Not Work For Some" });
      } else {
        results.push({ url, status: "Blocked" });
      }
    }
  }

  res.json({ results });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Jelly Watch backend running on port ${port}`));
