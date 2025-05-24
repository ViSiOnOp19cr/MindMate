import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createFolder = async (req: AuthRequest, res: Response) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.userId!;

    if (parentId) {
      const parentFolder = await prisma.folder.findFirst({
        where: { id: parentId, userId }
      });

      if (!parentFolder) {
        return res.status(404).json({ error: 'Parent folder not found' });
      }
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
        parentId: parentId || null
      },
      include: {
        children: true,
        notes: true
      }
    });

    res.status(201).json({ folder });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
};

export const getFolders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { parentId } = req.query;

    const folders = await prisma.folder.findMany({
      where: {
        userId,
        parentId: parentId ? String(parentId) : null
      },
      include: {
        children: true,
        notes: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ folders });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ error: 'Failed to get folders' });
  }
};

export const getFolder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const folder = await prisma.folder.findFirst({
      where: { id, userId },
      include: {
        children: true,
        notes: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true
          }
        },
        parent: true
      }
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.json({ folder });
  } catch (error) {
    console.error('Get folder error:', error);
    res.status(500).json({ error: 'Failed to get folder' });
  }
};

export const updateFolder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;
    const userId = req.userId!;

    const existingFolder = await prisma.folder.findFirst({
      where: { id, userId }
    });

    if (!existingFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    if (parentId) {
      const parentFolder = await prisma.folder.findFirst({
        where: { id: parentId, userId }
      });

      if (!parentFolder) {
        return res.status(404).json({ error: 'Parent folder not found' });
      }

      if (parentId === id) {
        return res.status(400).json({ error: 'Folder cannot be its own parent' });
      }
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: {
        name: name || existingFolder.name,
        parentId: parentId !== undefined ? parentId : existingFolder.parentId
      },
      include: {
        children: true,
        notes: true
      }
    });

    res.json({ folder });
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({ error: 'Failed to update folder' });
  }
};

export const deleteFolder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const folder = await prisma.folder.findFirst({
      where: { id, userId }
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    await prisma.folder.delete({
      where: { id }
    });

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
};