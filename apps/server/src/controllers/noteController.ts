import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { folderId, title, content } = req.body;
    const userId = req.userId!;

    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId }
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const note = await prisma.note.create({
      data: {
        folderId,
        title: title || 'Untitled Note',
        content: content || ''
      },
      include: {
        folder: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({ note });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { folderId } = req.query;

    if (folderId) {
      const folder = await prisma.folder.findFirst({
        where: { id: String(folderId), userId }
      });

      if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
      }

      const notes = await prisma.note.findMany({
        where: { folderId: String(folderId) },
        include: {
          folder: {
            select: { id: true, name: true }
          },
          summaries: {
            select: { id: true, createdAt: true }
          },
          quizzes: {
            select: { id: true, createdAt: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return res.json({ notes });
    }

    const notes = await prisma.note.findMany({
      where: {
        folder: { userId }
      },
      include: {
        folder: {
          select: { id: true, name: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to get notes' });
  }
};

export const getNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const note = await prisma.note.findFirst({
      where: {
        id,
        folder: { userId }
      },
      include: {
        folder: {
          select: { id: true, name: true }
        },
        summaries: {
          orderBy: { createdAt: 'desc' }
        },
        quizzes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to get note' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, folderId } = req.body;
    const userId = req.userId!;

    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        folder: { userId }
      }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (folderId) {
      const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId }
      });

      if (!folder) {
        return res.status(404).json({ error: 'Target folder not found' });
      }
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingNote.title,
        content: content !== undefined ? content : existingNote.content,
        folderId: folderId || existingNote.folderId
      },
      include: {
        folder: {
          select: { id: true, name: true }
        }
      }
    });

    res.json({ note });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const note = await prisma.note.findFirst({
      where: {
        id,
        folder: { userId }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.note.delete({
      where: { id }
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};