import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { folderService } from '../api/folderService';
import { noteService } from '../api/noteService';
import type { Folder, Note } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const foldersData = await folderService.getFolders();
        const notesData = await noteService.getNotes();
        
        // Ensure notesData is an array
        const notesArray = Array.isArray(notesData) ? notesData : [];
        
        // Sort notes by updated date
        const sortedNotes = [...notesArray].sort((a, b) => 
          new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime()
        );
        
        setFolders(foldersData);
        setRecentNotes(sortedNotes.slice(0, 5)); // Get 5 most recent notes
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }
    
    try {
      const newFolder = await folderService.createFolder({ name: newFolderName });
      // Ensure folders is treated as an array
      const currentFolders = Array.isArray(folders) ? folders : [];
      setFolders([...currentFolders, newFolder]);
      setNewFolderName('');
      setShowNewFolderForm(false);
      toast.success('Folder created successfully');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <p>Manage your notes and study materials from one place</p>
      </header>

      <div className="dashboard-content">
        <section className="folders-section">
          <div className="section-header">
            <h2>Your Folders</h2>
            <button 
              className="add-btn"
              onClick={() => setShowNewFolderForm(!showNewFolderForm)}
            >
              {showNewFolderForm ? 'Cancel' : '+ New Folder'}
            </button>
          </div>
          
          {showNewFolderForm && (
            <form onSubmit={handleCreateFolder} className="new-folder-form">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                required
              />
              <button type="submit">Create</button>
            </form>
          )}
          
          <div className="folders-grid">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <Link to={`/notes?folderId=${folder.id}`} key={folder.id} className="folder-card">
                  <div className="folder-icon">📁</div>
                  <h3>{folder.name}</h3>
                  <p>Created: {new Date(folder.createdAt).toLocaleDateString()}</p>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <p>No folders yet. Create your first folder to get started!</p>
              </div>
            )}
          </div>
        </section>

        <section className="recent-notes-section">
          <div className="section-header">
            <h2>Recent Notes</h2>
            <Link to="/notes" className="view-all-link">View All</Link>
          </div>
          
          <div className="notes-list">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <Link to={`/notes/${note.id}`} key={note.id} className="note-card">
                  <h3>{note.title || 'Untitled Note'}</h3>
                  <p className="note-preview">
                    {note.content ? (
                      note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '')
                    ) : (
                      'No content'
                    )}
                  </p>
                  <p className="note-date">
                    Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <p>No notes yet. Start creating notes to see them here!</p>
              </div>
            )}
          </div>
        </section>

        <section className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/notes" className="action-card">
              <div className="action-icon">📝</div>
              <h3>All Notes</h3>
              <p>Browse and manage all your notes</p>
            </Link>
            
            <Link to="/ai-chat" className="action-card">
              <div className="action-icon">💬</div>
              <h3>AI Chat</h3>
              <p>Ask questions and get help from AI</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
