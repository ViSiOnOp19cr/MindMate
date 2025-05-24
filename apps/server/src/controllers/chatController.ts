import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { message, response } = req.body;
    const userId = req.userId!;

    if (!message || !response) {
      return res.status(400).json({ error: 'Message and response are required' });
    }

    const chatHistory = await prisma.chatHistory.create({
      data: {
        userId,
        message,
        response
      }
    });

    res.status(201).json({ chatHistory });
  } catch (error) {
    console.error('Create chat message error:', error);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit = 50, offset = 0 } = req.query;

    const chatHistory = await prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    const total = await prisma.chatHistory.count({
      where: { userId }
    });

    res.json({ 
      chatHistory,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
};

export const deleteChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const chatMessage = await prisma.chatHistory.findFirst({
      where: { id, userId }
    });

    if (!chatMessage) {
      return res.status(404).json({ error: 'Chat message not found' });
    }

    await prisma.chatHistory.delete({
      where: { id }
    });

    res.json({ message: 'Chat message deleted successfully' });
  } catch (error) {
    console.error('Delete chat message error:', error);
    res.status(500).json({ error: 'Failed to delete chat message' });
  }
};

export const clearChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const result = await prisma.chatHistory.deleteMany({
      where: { userId }
    });

    res.json({ 
      message: 'Chat history cleared successfully',
      deletedCount: result.count
    });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};