import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    course,
    year,
    preferredSubjects,
    weakSubjects,
    studyGoals,
    examDate,
  } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("User already exists with this email", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "student",
    course: course || "",
    year: year || "",
    preferredSubjects: preferredSubjects || [],
    weakSubjects: weakSubjects || [],
    studyGoals: studyGoals || "",
    examDate: examDate || "",
  });

  const token = generateToken(user._id);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      year: user.year,
      preferredSubjects: user.preferredSubjects,
      weakSubjects: user.weakSubjects,
      studyGoals: user.studyGoals,
      examDate: user.examDate,
      token,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      year: user.year,
      preferredSubjects: user.preferredSubjects,
      weakSubjects: user.weakSubjects,
      studyGoals: user.studyGoals,
      examDate: user.examDate,
      token,
    },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: req.user,
  });
});