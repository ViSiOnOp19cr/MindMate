import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { generateSummaryWithAI, generateQuizWithAI, generateChatResponse } from '../lib/openai';

export const generateSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { noteId } = req.body;
    const userId = req.userId!;

    if (!noteId) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        folder: { userId }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (!note.content || note.content.trim().length === 0) {
      return res.status(400).json({ error: 'Note content is empty' });
    }

    const aiSummary = await generateSummaryWithAI(note.content, note.title || undefined);

    const summary = await prisma.summary.create({
      data: {
        noteId,
        gptResponse: aiSummary
      },
      include: {
        note: {
          select: { id: true, title: true }
        }
      }
    });

    res.status(201).json({ summary });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

export const generateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { noteId } = req.body;
    const userId = req.userId!;

    if (!noteId) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        folder: { userId }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (!note.content || note.content.trim().length === 0) {
      return res.status(400).json({ error: 'Note content is empty' });
    }

    const aiQuiz = await generateQuizWithAI(note.content, note.title || undefined);

    const quiz = await prisma.quiz.create({
      data: {
        noteId,
        gptResponse: aiQuiz
      },
      include: {
        note: {
          select: { id: true, title: true }
        }
      }
    });

    res.status(201).json({ quiz });
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
};

export const getSummaries = async (req: AuthRequest, res: Response) => {
  try {
    const { noteId } = req.query;
    const userId = req.userId!;

    if (noteId) {
      const note = await prisma.note.findFirst({
        where: {
          id: String(noteId),
          folder: { userId }
        }
      });

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      const summaries = await prisma.summary.findMany({
        where: { noteId: String(noteId) },
        include: {
          note: {
            select: { id: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.json({ summaries });
    }

    const summaries = await prisma.summary.findMany({
      where: {
        note: {
          folder: { userId }
        }
      },
      include: {
        note: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ summaries });
  } catch (error) {
    console.error('Get summaries error:', error);
    res.status(500).json({ error: 'Failed to get summaries' });
  }
};

export const getQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const { noteId } = req.query;
    const userId = req.userId!;

    if (noteId) {
      const note = await prisma.note.findFirst({
        where: {
          id: String(noteId),
          folder: { userId }
        }
      });

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      const quizzes = await prisma.quiz.findMany({
        where: { noteId: String(noteId) },
        include: {
          note: {
            select: { id: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.json({ quizzes });
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        note: {
          folder: { userId }
        }
      },
      include: {
        note: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Failed to get quizzes' });
  }
};

export const deleteSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const summary = await prisma.summary.findFirst({
      where: {
        id,
        note: {
          folder: { userId }
        }
      }
    });

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    await prisma.summary.delete({
      where: { id }
    });

    res.json({ message: 'Summary deleted successfully' });
  } catch (error) {
    console.error('Delete summary error:', error);
    res.status(500).json({ error: 'Failed to delete summary' });
  }
};

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        note: {
          folder: { userId }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    await prisma.quiz.delete({
      where: { id }
    });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
};

export const chatWithAI = async (req: AuthRequest, res: Response) => {
  try {
    const { message, noteId } = req.body;
    const userId = req.userId!;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let context = '';
    if (noteId) {
      const note = await prisma.note.findFirst({
        where: {
          id: noteId,
          folder: { userId }
        }
      });

      if (note && note.content) {
        context = `Note title: ${note.title || 'Untitled'}\nNote content: ${note.content}`;
      }
    }

    const aiResponse = await generateChatResponse(message, context);

    const chatHistory = await prisma.chatHistory.create({
      data: {
        userId,
        message,
        response: aiResponse
      }
    });

    res.status(201).json({ 
      message: chatHistory.message,
      response: chatHistory.response,
      id: chatHistory.id,
      createdAt: chatHistory.createdAt
    });
  } catch (error) {
    console.error('Chat with AI error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
};