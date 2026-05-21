import fs from "fs";
import path from "path";
import Material from "../models/Material.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Helper — calls the AI ingestion service with an absolute file path
const callIngestService = async (material) => {
  const absolutePath = path.resolve(material.filePath);
  const response = await fetch(`${process.env.AI_SERVICE_URL}/materials/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      materialId: material._id.toString(),
      filePath: absolutePath,
      title: material.title,
      subject: material.subject,
      chapter: material.chapter,
      topic: material.topic,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`AI service error ${response.status}: ${errBody}`);
  }

  return response.json();
};

export const uploadMaterial = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("File upload is required", 400);
  }

  const { title, subject, chapter, topic, description } = req.body;

  const material = await Material.create({
    userId: req.user._id,
    title,
    originalFileName: req.file.originalname,
    fileType: req.file.mimetype,
    filePath: req.file.path,
    fileSize: req.file.size,
    subject,
    chapter,
    topic,
    description,
    processingStatus: "pending",
  });

  let ingestionResponse = null;

  try {
    ingestionResponse = await callIngestService(material);
    material.processingStatus = "processed";
    await material.save();
  } catch (error) {
    material.processingStatus = "failed";
    await material.save();
  }

  return res.status(201).json({
    success: true,
    message: "Material uploaded successfully",
    data: { material, ingestionResponse },
  });
});

// Re-process a previously failed material
export const reprocessMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!material) {
    throw new AppError("Material not found", 404);
  }

  const absolutePath = path.resolve(material.filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new AppError("File no longer exists on disk — please re-upload", 404);
  }

  material.processingStatus = "pending";
  await material.save();

  let ingestionResponse = null;
  try {
    ingestionResponse = await callIngestService(material);
    material.processingStatus = "processed";
    await material.save();
  } catch (error) {
    material.processingStatus = "failed";
    await material.save();
    throw new AppError(`Ingestion failed: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    message: "Material reprocessed successfully",
    data: { material, ingestionResponse },
  });
});



export const getMyMaterials = asyncHandler(async (req, res) => {
  const materials = await Material.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    data: materials,
  });
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!material) {
    throw new AppError("Material not found", 404);
  }

  if (material.filePath && fs.existsSync(material.filePath)) {
    fs.unlinkSync(material.filePath);
  }

  await Material.deleteOne({ _id: material._id });

  return res.status(200).json({
    success: true,
    message: "Material deleted successfully",
  });
});