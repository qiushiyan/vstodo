import express from "express";
import "reflect-metadata";
import { createConnection, TransactionAlreadyStartedError } from "typeorm";
import path from "path";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import User from "./entities/User";
import jwt from "jsonwebtoken";
import Todo from "./entities/Todo";
import isAuth from "./isAuth";

dotenv.config();

const bootstrap = async () => {
  await createConnection({
    type: "postgres",
    synchronize: true,
    username: "qiushi",
    // logging: true,
    password: "qiushi",
    database: "vstodo",
    entities: [path.join(__dirname, "./entities/*.*")],
  });
  const app = express();
  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });

  app.use(cors({ origin: "*" }));
  app.use(passport.initialize());
  app.use(express.json());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:3000/auth/github/callback",
      },
      async (_, __, profile, cb) => {
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          // update user info
          user.name = profile.displayName;
          await user.save();
        } else {
          // create user if not exist
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }
        cb(null, {
          accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "1y",
          }),
        });
      }
    )
  );

  app.get("/", (_, res) => {
    res.send("hello");
  });

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/" }),
    function (req, res) {
      // Successful authentication, redirect home.
      // @ts-ignore
      const { accessToken } = req.user!;
      res.redirect(`http://localhost:54321/auth/${accessToken}`);
    }
  );

  app.get("/todo", isAuth, async (req: any, res) => {
    const userId = req.userId;
    const todos = await Todo.find({
      where: { creatorId: userId },
      order: { id: "DESC" },
    });
    res.send({ data: todos });
  });

  app.post("/todo", isAuth, async (req: any, res) => {
    // {title: ""}
    const title = req.body.title;
    const creatorId = req.userId;
    const newTodo = await Todo.create({ title, creatorId }).save();
    res.send({ newTodo });
  });

  app.put("/todo", isAuth, async (req: any, res) => {
    const todo = await Todo.findOne(req.body.id);
    if (!todo) {
      res.send({ todo: null });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.send({ todo });
  });

  // get the current user
  app.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.send({ user: null });
      return;
    }

    let userId = "";

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      userId = payload.userId;
    } catch {
      res.send({ user: null });
      return;
    }

    if (!userId) {
      res.send({ user: null });
      return;
    }

    const user = await User.findOne(userId);
    console.log("find the user", user);
    res.send({ user });
  });

  app.listen(3000, () => {
    console.log("🚀 server started at port http://localhost:3000");
  });
};

bootstrap();
