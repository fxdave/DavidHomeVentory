import express from "express";
import dotenv from "dotenv";
import {createBuilder, initRpc} from "@cuple/server";
import {initWarehouseModule} from "./modules/warehouse";
import {createAuthLink, initAuthModule} from "./modules/auth";
import {PrismaClient} from "@prisma/client";

dotenv.config();

const app = express();
const db = new PrismaClient();

const builder = createBuilder(app);
const authLink = createAuthLink(builder);
const authedBuilder = builder.chain(authLink);
export type Builder = typeof builder;
export type AuthedBuilder = typeof authedBuilder;

const routes = {
  auth: initAuthModule(db, builder),
  warehouse: initWarehouseModule(db, builder.chain(authLink)),
};

initRpc(app, {
  path: "/api/rpc",
  routes,
});

export type Routes = typeof routes;

const port = 3001;
app.bind("0.0.0.0");
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${port}`);
});
