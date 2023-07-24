import {
  getAllGroups,
  getGroupByID,
  postGroup,
  putGroup,
  deleteGroup,
  postUserGroup,
} from "./GroupControllers";
import { GroupModel } from "../model/GroupData";
import { User } from "../model/UserData";

const statusCodes = require("../constants/constants").HTTP_STATUS;

const httpStatusOK = statusCodes.OK;
const httpStatusNotFound = statusCodes.NOT_FOUND;
const httpStatusServerError = statusCodes.INTERNAL_SERVER_ERROR;

jest.mock("../model/GroupData");
jest.mock("../model/UserData");
jest.mock("../model/UserGroupData");

describe("getAllGroups", () => {
  let res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  it("should return all groups", async () => {
    const mockGroups = [
      { id: 1, name: "Group 1", permissions: ["READ"] },
      { id: 2, name: "Group 2", permissions: ["WRITE"] },
    ];
    GroupModel.findAll.mockResolvedValue(mockGroups);

    await getAllGroups({}, res);

    expect(GroupModel.findAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockGroups);
  });

  it("should return a 404 status if no groups are found", async () => {
    GroupModel.findAll.mockResolvedValue(null);

    await getAllGroups({}, res);

    expect(GroupModel.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(httpStatusNotFound);
    expect(res.json).toHaveBeenCalledWith({ message: "Groups are not found" });
  });

  it("should return a 500 status if an error occurs", async () => {
    const error = new Error("Database error");
    GroupModel.findAll.mockRejectedValue(error);

    await getAllGroups({}, res);

    expect(GroupModel.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(httpStatusServerError);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

describe("getGroupByID", () => {
  let res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  it("should return the group with the specified ID", async () => {
    const mockGroup = { id: 1, name: "Group 1", permissions: "read" };
    GroupModel.findByPk.mockResolvedValue(mockGroup);

    const req = {
      params: { id: 1 },
    };

    await getGroupByID(req, res);

    expect(GroupModel.findByPk).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockGroup);
  });

  it("should return a 404 status if the group is not found", async () => {
    GroupModel.findByPk.mockResolvedValue(null);

    const req = {
      params: { id: 1 },
    };

    await getGroupByID(req, res);

    expect(GroupModel.findByPk).toHaveBeenCalledWith(1);
    expect(res.sendStatus).toHaveBeenCalledWith(httpStatusNotFound);
    expect(res.json).toHaveBeenCalledWith({
      message: "Group with id 1 not found!",
    });
  });

  it("should return a 500 status if an error occurs", async () => {
    const error = new Error("Database error");
    GroupModel.findByPk.mockRejectedValue(error);

    const req = {
      params: { id: 1 },
    };

    await getGroupByID(req, res);

    expect(GroupModel.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(httpStatusServerError);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

describe("postGroup", () => {
  let res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  it("should create a new group", async () => {
    const req = {
      body: { name: "Group 1", permissions: "read" },
    };

    await postGroup(req, res);

    expect(GroupModel.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should return a 500 status if an error occurs", async () => {
    const error = new Error("Database error");
    GroupModel.create.mockRejectedValue(error);

    const req = {
      body: { name: "Group 1", permissions: "read" },
    };

    await postGroup(req, res);

    expect(GroupModel.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(httpStatusServerError);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

describe("putGroup", () => {
  let res;

  beforeEach(() => {
    res = {
      sendStatus: jest.fn(),
    };
  });

  it("should update the group with the specified ID", async () => {
    const req = {
      params: { id: 1 },
      body: { name: "Group 1 Updated", permissions: "write" },
    };

    await putGroup(req, res);

    expect(GroupModel.update).toHaveBeenCalledWith(
      {
        name: req.body.name,
        permissions: req.body.permissions,
      },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    );
    expect(res.sendStatus).toHaveBeenCalledWith(httpStatusOK);
  });

  it("should return a 500 status if an error occurs", async () => {
    const error = new Error("Database error");
    GroupModel.update.mockRejectedValue(error);

    const req = {
      params: { id: 1 },
      body: { name: "Group 1 Updated", permissions: "write" },
    };

    await putGroup(req, res);

    expect(GroupModel.update).toHaveBeenCalledWith(
      {
        name: req.body.name,
        permissions: req.body.permissions,
      },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    );
    expect(res.sendStatus).toHaveBeenCalledWith(httpStatusServerError);
  });
});

describe("deleteGroup", () => {
  let res;

  beforeEach(() => {
    res = {
      sendStatus: jest.fn(),
    };
  });

  it("should delete the group with the specified ID", async () => {
    const req = {
      params: { id: 1 },
    };

    await deleteGroup(req, res);

    expect(GroupModel.destroy).toHaveBeenCalledWith({
      where: { id: req.params.id },
    });
    expect(res.sendStatus).toHaveBeenCalledWith(httpStatusOK);
  });

  it("should return a 500 status if an error occurs", async () => {
    const error = new Error("Database error");
    GroupModel.destroy.mockRejectedValue(error);

    const req = {
      params: { id: 1 },
    };

    await deleteGroup(req, res);

    expect(GroupModel.destroy).toHaveBeenCalledWith({
      where: { id: req.params.id },
    });
    expect(res.sendStatus).toHaveBeenCalledWith(httpStatusServerError);
  });
});

describe("postUserGroup", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
  });

  it("should add users to the group", async () => {
    const mockGroup = { id: 1, name: "Group 1", permissions: "read" };
    GroupModel.findByPk.mockResolvedValue(mockGroup);

    const mockUsers = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ];
    User.findAll.mockResolvedValue(mockUsers);

    const req = {
      params: { id: 1 },
      body: { userIds: [1, 2] },
    };

    await postUserGroup(req, res);

    expect(GroupModel.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(User.findAll).toHaveBeenCalledWith({
      where: {
        id: req.body.userIds,
        isDeleted: false,
      },
      transaction: expect.any(Object),
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should return a 404 status if the group does not exist", async () => {
    GroupModel.findByPk.mockResolvedValue(null);

    const req = {
      params: { id: 1 },
      body: { userIds: [1, 2] },
    };

    await postUserGroup(req, res);

    expect(GroupModel.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(httpStatusNotFound);
    expect(res.send).toHaveBeenCalledWith("Group does not exist");
  });

  it("should return a 500 status if an error occurs", async () => {
    const error = new Error("Database error");
    GroupModel.findByPk.mockRejectedValue(error);

    const req = {
      params: { id: 1 },
      body: { userIds: [1, 2] },
    };

    await postUserGroup(req, res);

    expect(GroupModel.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(httpStatusServerError);
    expect(res.send).toHaveBeenCalledWith({ message: "Server error" });
  });
});
