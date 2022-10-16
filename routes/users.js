var express = require("express");
var router = express.Router();
const userModel = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");

router.get("/", async function (req, res, next) {
  try {
    const users = await userModel.find({}).lean();
    res.status(StatusCodes.OK).json(users);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { fullName, age, moyenne } = req.body;
    const checkIfExist = await userModel.findOne({ fullName }).lean();
    if (checkIfExist) {
      throw new Error("user already exist");
    }
    const userSchema = new userModel({ fullName, age, moyenne });
    const user = await userSchema.save();
    res.status(StatusCodes.CREATED).json(user);
  } catch (err) {
    res.status(StatusCodes.CONFLICT).json({ message: err.message });
  }
});

router.put("/:userId", async function (req, res, next) {
  try {
    const { userId } = req.params;
    const { fullName, age, moyenne } = req.body;
    const checkIfExist = await userModel.findById(userId).lean();
    if (!checkIfExist) {
      throw new Error("user not found!");
    }
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        fullName,
        age,
        moyenne,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
  }
});

router.delete("/:userId", async function (req, res, next) {
  try {
    const { userId } = req.params;
    const checkIfExist = await userModel.findById(userId).lean();
    if (!checkIfExist) {
      throw new Error("user not found!");
    }
    await userModel.findByIdAndDelete(userId);
    res.status(StatusCodes.OK).json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
  }
});

router.get("/mention/:userId", async function (req, res, next) {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("user not found!");
    }
    switch (true) {
      case user.moyenne >= 10 && user.moyenne <= 12:
        res.status(StatusCodes.OK).json({ mention: "pass" });
        break;
      case user.moyenne < 10:
        res.status(StatusCodes.OK).json({ mention: "fail" });
        break;
      case user.moyenne > 12 && user.moyenne < 15:
        res.status(StatusCodes.OK).json({ mention: "good" });
        break;
      case user.moyenne >= 15 && user.moyenne < 18:
        res.status(StatusCodes.OK).json({ mention: "very good" });
        break;
      case user.moyenne >= 18 && user.moyenne <= 20:
        res.status(StatusCodes.OK).json({ mention: "excellent" });
        break;
      default:
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "moyenne invalide!" });
    }
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
  }
});

module.exports = router;
