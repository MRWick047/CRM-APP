require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Pool } = require("pg");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.get("/", (req, res) => {
  res.json({ message: "SRCRM API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/api/:table", async (req, res) => {
  try {
    const table = req.params.table;
    const result = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/:table", async (req, res) => {
  try {
    const table = req.params.table;
    const data = req.body;

    const keys = Object.keys(data);
    const values = Object.values(data);

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `
      INSERT INTO ${table} (${keys.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await pool.query(query, values);

    io.emit("data_changed", {
      table,
      action: "create",
      data: result.rows[0]
    });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/:table/:id", async (req, res) => {
  try {
    const table = req.params.table;
    const { id } = req.params;
    const data = req.body;

    const keys = Object.keys(data);
    const values = Object.values(data);

    const setQuery = keys.map((key, i) => `${key}=$${i + 1}`).join(", ");
    const query = `
      UPDATE ${table}
      SET ${setQuery}
      WHERE id=$${keys.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);

    io.emit("data_changed", {
      table,
      action: "update",
      data: result.rows[0]
    });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/:table/:id", async (req, res) => {
  try {
    const table = req.params.table;
    const { id } = req.params;

    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);

    io.emit("data_changed", {
      table,
      action: "delete",
      id
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

io.on("connection", socket => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`SRCRM server running on port ${PORT}`);
});