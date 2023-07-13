import {
  getUsersBySubstring,
  getUsersByID,
  postUser,
  putUser,
  deleteUser,
  getUserByCredentials,
} from "./UserControllers";
import { User } from "../model/UserData";
import { Op } from "sequelize";

jest.mock("../model/UserData", () => ({
  User: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsersBySubstring", () => {
    it("should return list of users when users are found", async () => {
      const req = { query: { loginSubstring: "abc", limit: 10 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      User.findAll.mockResolvedValueOnce([{ id: 1, login: "abc123" }]);

      await getUsersBySubstring(req, res);

      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          login: {
            [Op.iLike]: "%abc%",
          },
        },
        order: ["login"],
        limit: 10,
      });
      expect(res.json).toHaveBeenCalledWith({
        users: [{ id: 1, login: "abc123" }],
      });
    });

    it("should return 404 status when no users are found", async () => {
      const req = { query: { loginSubstring: "xyz", limit: 10 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      User.findAll.mockResolvedValueOnce([]);

      await getUsersBySubstring(req, res);

      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          login: {
            [Op.iLike]: "%xyz%",
          },
        },
        order: ["login"],
        limit: 10,
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No users(" });
    });
  });

  describe("getUsersByID", () => {
    it("should return the user when user is found", async () => {
      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      User.findByPk.mockResolvedValueOnce({ id: 1, login: "test" });

      await getUsersByID(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ id: 1, login: "test" });
    });

    it("should return 404 status when user is not found", async () => {
      const req = { params: { id: 2 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      User.findByPk.mockResolvedValueOnce(null);

      await getUsersByID(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User with id 2 not found!",
      });
    });

    it("should return 500 status when an error occurs", async () => {
      const req = { params: { id: 3 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      User.findByPk.mockRejectedValueOnce("Error");

      await getUsersByID(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(3);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
  describe("postUser", () => {
    it("should create a new user and return 201 status with the created user", async () => {
      const req = {
        body: { login: "testUser", password: "testPassword", age: 25 },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const newUser = { id: 1, login: "testUser", age: 25 };
      User.create.mockResolvedValueOnce(newUser);

      await postUser(req, res);

      expect(User.create).toHaveBeenCalledWith({
        login: "testUser",
        password: "testPassword",
        age: 25,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUser);
    });

    it("should return 500 status when an error occurs", async () => {
      const req = {
        body: { login: "testUser", password: "testPassword", age: 25 },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      User.create.mockRejectedValueOnce("Error");

      await postUser(req, res);

      expect(User.create).toHaveBeenCalledWith({
        login: "testUser",
        password: "testPassword",
        age: 25,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
  describe("putUser", () => {
    it("should update the user and return 200 status", async () => {
      const req = {
        params: { id: 1 },
        body: { login: "newUser", password: "newPassword", age: 30 },
      };
      const res = {
        sendStatus: jest.fn(),
      };
      User.update.mockResolvedValueOnce();

      await putUser(req, res);

      expect(User.update).toHaveBeenCalledWith(
        {
          login: "newUser",
          password: "newPassword",
          age: 30,
        },
        {
          where: {
            id: 1,
            isDeleted: false,
          },
          returning: true,
        }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
  });
  describe("deleteUser", () => {
    it("should mark the user as deleted and return 200 status", async () => {
      const req = { params: { id: 1 } };
      const res = {
        sendStatus: jest.fn(),
      };
      User.update.mockResolvedValueOnce();

      await deleteUser(req, res);

      expect(User.update).toHaveBeenCalledWith(
        {
          isDeleted: true,
        },
        {
          where: {
            id: 1,
            isDeleted: false,
          },
        }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe("getUserByCredentials", () => {
    it("should return the user when user with given credentials is found", async () => {
      const login = "testUser";
      const password = "testPassword";
      const expectedUser = { id: 1, login: "testUser" };
      User.findOne.mockResolvedValueOnce(expectedUser);

      const user = await getUserByCredentials(login, password);

      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          login: "testUser",
          password: "testPassword",
        },
      });
      expect(user).toEqual(expectedUser);
    });

    it("should return null when user with given credentials is not found", async () => {
      const login = "testUser";
      const password = "testPassword";
      User.findOne.mockResolvedValueOnce(null);

      const user = await getUserByCredentials(login, password);

      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          login: "testUser",
          password: "testPassword",
        },
      });
      expect(user).toBeNull();
    });
  });
});
