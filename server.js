const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const PORT = process.env.PORT || 3000;

let namesData = [];

// Load CSV
fs.createReadStream("names.csv")
  .pipe(csv())
  .on("data", (row) => {
  // skip empty rows
  if (!row.Name || row.Name.trim() === "") return;

  namesData.push(row);
})
  .on("end", () => {
    console.log("CSV Loaded");
    console.log(namesData); // DEBUG (you can remove later)
  });

// API
app.use(express.static(__dirname));
app.get("/search", (req, res) => {
  const input = req.query.name?.toLowerCase();

  if (!input) {
    return res.json({ message: "No name provided" });
  }

  const result = namesData.find(
    (n) => n.Name.toLowerCase() === input
  );

  if (result) {
    res.json(result);
  } else {
    res.json({ message: "Not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});