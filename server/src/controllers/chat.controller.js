import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Material from "../models/Material.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const createChat = asyncHandler(async (req, res) => {
  const { title = "New Chat", subject = "", linkedMaterialIds = [] } = req.body;

  const chat = await Chat.create({
    userId: req.user._id,
    title,
    subject,
    linkedMaterialIds,
    lastMessageAt: new Date(),
  });

  return res.status(201).json({
    success: true,
    message: "Chat created successfully",
    data: chat,
  });
});

export const getMyChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ userId: req.user._id })
    .sort({ lastMessageAt: -1 })
    .populate("linkedMaterialIds", "title subject topic processingStatus");

  return res.status(200).json({
    success: true,
    data: chats,
  });
});

export const getChatMessages = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    data: {
      chat,
      messages,
    },
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const chat = await Chat.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate("linkedMaterialIds");

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  if (!content || !content.trim()) {
    throw new AppError("Message content is required", 400);
  }

  const processedMaterialIds = (chat.linkedMaterialIds || [])
    .filter((item) => item.processingStatus === "processed")
    .map((item) => item._id.toString());

  const userMessage = await Message.create({
    chatId: chat._id,
    sender: "user",
    content: content.trim(),
    messageType: "question",
    subject: chat.subject || "",
  });

  let aiResponse;

  try {
    const response = await fetch(`${process.env.AI_SERVICE_URL}/chat/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: content.trim(),
        materialIds: processedMaterialIds,
        subject: chat.subject || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service responded with status ${response.status}`);
    }

    aiResponse = await response.json();
  } catch (error) {
    throw new AppError("Failed to get response from AI service", 502, error.message);
  }

  const assistantMessage = await Message.create({
    chatId: chat._id,
    sender: "assistant",
    content: aiResponse.answer,
    messageType: "answer",
    citedChunks: (aiResponse.citations || []).map((citation) => ({
      materialId: citation.materialId,
      chunkId: citation.chunkId,
      excerpt: citation.excerpt,
    })),
    subject: chat.subject || "",
  });

  chat.lastMessageAt = new Date();
  await chat.save();

  return res.status(201).json({
    success: true,
    data: {
      userMessage,
      assistantMessage,
    },
  });
});

export const getProcessedMaterialsForChat = asyncHandler(async (req, res) => {
  const materials = await Material.find({
    userId: req.user._id,
    processingStatus: "processed",
  }).select("title subject topic processingStatus");

  return res.status(200).json({
    success: true,
    data: materials,
  });
});