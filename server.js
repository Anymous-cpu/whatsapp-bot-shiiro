const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Shiiro Bot is running on Railway!"));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
