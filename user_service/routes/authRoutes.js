import Fastify from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Export as a Fastify plugin function
export default async function authRoutes(fastify, options) {
  const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  fastify.post("/register", async (request, reply) => {
    const { firstname, lastname, username, email, password } = request.body;

    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return reply.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users (firstname, lastname, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [firstname, lastname, username, email, hashedPassword]
    );

    return reply.status(201).send({ message: "User created", user: newUser.rows[0] });
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return reply.status(404).send({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return reply.status(400).send({ message: "Invalid password" });
    }

    const token = generateToken({
      id: user.rows[0].id,
      email: user.rows[0].email,
    });

    return reply.status(200).send({ message: "Login successful", token });
  });

  fastify.get("/validate", async (request, reply) => {
    const authorization = request.headers["authorization"];
    if (!authorization) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
      const tokenData = authorization.split(" ")[1];
      const user = jwt.verify(tokenData, process.env.JWT_SECRET);
      return reply.status(200).send({ ...user });
    } catch (error) {
      return reply.status(403).send({ message: "Invalid token" });
    }
  });

  // Middleware to authorize routes
  const requestAuthorizer = async (request, reply) => {
    const token = request.headers["authorization"];

    if (!token) {
      return reply.status(403).send({ message: "No token provided" });
    }

    const tokenData = token.split(" ")[1];
    try {
      const decoded = jwt.verify(tokenData, process.env.JWT_SECRET);
      request.user = decoded;
    } catch (err) {
      return reply.status(401).send({ message: "Invalid token" });
    }
  };

  // Example of a protected route
  fastify.get("/profile", { preHandler: requestAuthorizer }, async (request, reply) => {
    const authorisedUser = request.user;
    return reply.send({
      message: "User profile fetched successfully",
      user: authorisedUser,
    });
  });

}
