import express from "express";
import pgClient from "./database";
import { commonResponse, commonError } from "./constants/outcomeHandlers";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserNameById,
  deleteUserById,
  deleteConnection,
  createConnection,
  getConnections,
  getConnectionByBothIds,
  getDistance,
} from "./constants/queries";
import { User } from "./types/user";
import {
  RequestCreateUser,
  RequestUpdateUser,
  RequestUserById,
  RequestDeleteUser,
  RequestCreateConnection,
  RequestDistance,
} from "./constants/requestShape";
import { Connection, Distance } from "./types/connection";

const port = 2000;

const app = express();

app.use(express.json());

app.post("/users/create", async ({ body }: RequestCreateUser, res: any) => {
  try {
    if (!body?.name) {
      throw new Error("Missing body details for name");
    }
    const { name } = body;
    await pgClient.query<User>(createUser, [name]);
    res.status(200).send(commonResponse<User[]>([]));
  } catch (error) {
    res.status(500).send(commonError(error as Error));
  }
});

app.get("/users/:id", async ({ params }: RequestUserById, res: any) => {
  try {
    const { id } = params;
    const { rows: userRows, rowCount } = await pgClient.query<User>(
      getUserById,
      [id]
    );

    if (!rowCount) {
      return res
        .status(200)
        .send(
          commonResponse<Record<string, any>>({}, "Finished but nothing found")
        );
    }
    const [firstRow] = userRows;
    return res.status(200).send(commonResponse<User>(firstRow));
  } catch (error) {
    res.status(500).send(commonError(error as Error));
  }
});

app.get("/users", async (req: any, res: any) => {
  try {
    const { rows: userRows } = await pgClient.query<User>(getAllUsers);
    res.status(200).send(commonResponse<User[]>(userRows));
  } catch (error) {
    res.status(500).send(commonError(error as Error));
  }
});

app.put("/users/:id", async ({ body, params }: RequestUpdateUser, res: any) => {
  try {
    if (!body?.name) {
      throw new Error("Missing body details for name");
    }
    const { name } = body;
    const { id } = params;

    // Ensure user exists first, exit early if no change
    const { rows: userRows, rowCount } = await pgClient.query<User>(
      getUserById,
      [id]
    );
    if (!rowCount) throw new Error("Cannot update user that does not exist");
    const [user] = userRows;
    if (user.name === name)
      return res
        .status(200)
        .send(
          commonResponse<Record<string, any>>(
            {},
            `No need to update user.id of ${id} with the same name`
          )
        );

    await pgClient.query<User>(updateUserNameById, [name, id]);

    return res
      .status(200)
      .send(
        commonResponse<Record<string, any>>(
          {},
          `Success in updating user.id of ${id}`
        )
      );
  } catch (error) {
    res.status(500).send(commonError(error as Error));
  }
});

app.delete("/users/:id", async ({ params }: RequestDeleteUser, res: any) => {
  try {
    const { id } = params;

    await pgClient.query<Connection>(deleteConnection, [id]);

    const { rowCount } = await pgClient.query<User>(deleteUserById, [id]);
    if (!rowCount) {
      return res.status(404).send(
        commonError({
          name: "Warning",
          message: "User does not exist to delete.",
        })
      );
    }

    return res
      .status(200)
      .send(
        commonResponse<Record<string, any>>(
          {},
          `Success in deleting user.id of ${id}`
        )
      );
  } catch (error) {
    res.status(500).send(commonError(error as Error));
  }
});

app.get("/connections", async (req: any, res: any) => {
  try {
    const { rows: connectionRows } = await pgClient.query<Connection>(
      getConnections
    );
    res.status(200).send(commonResponse<Connection[]>(connectionRows));
  } catch (error) {
    res.status(500).send(commonError(error as Error));
  }
});

app.post(
  "/connections/:userId/:friendId",
  async ({ params }: RequestCreateConnection, res: any) => {
    try {
      const { userId, friendId } = params;
      if (!userId || !friendId)
        return res.status(404).send(
          commonError({
            name: "Error",
            message: "Connection requires two ids to create",
          })
        );

      // verify connection has not been made
      const { rowCount: foundCount, rows: foundRows } =
        await pgClient.query<Connection>(getConnectionByBothIds, [
          userId,
          friendId,
        ]);
      if (!!foundCount && foundCount >= 2) {
        return res
          .status(200)
          .send(
            commonResponse<Record<string, any>>(
              {},
              `Connection of user.id ${userId} and user.id ${friendId} already exists`
            )
          );
      }

      await pgClient.query<Connection>(createConnection, [userId, friendId]);

      return res
        .status(200)
        .send(
          commonResponse<Record<string, any>>(
            {},
            `Success in connection of user.id ${userId} and user.id ${friendId}`
          )
        );
    } catch (error) {
      res.status(500).send(commonError(error as Error));
    }
  }
);

app.get(
  "/distance/:userId/:friendId",
  async ({ params }: RequestDistance, res: any) => {
    try {
      const { userId, friendId } = params;
      if (!userId || !friendId)
        return res.status(404).send(
          commonError({
            name: "Error",
            message:
              "Connection requires two ids to find the connection distance of",
          })
        );

      const result = await pgClient.query<Distance>(getDistance, [
        userId,
        friendId,
      ]);

      const distance = result?.rows[0]?.distance;
      if (typeof distance !== "number") {
        throw new Error("Could not find distance");
      }

      res.status(200).send(
        commonResponse<Omit<Distance, "user_id" | "friend_id">>(
          {
            distance,
          },
          `User.id of ${userId} and user.id of ${friendId} are ${distance} friends away`
        )
      );
    } catch (error) {
      res.status(500).send(commonError(error as Error));
    }
  }
);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
