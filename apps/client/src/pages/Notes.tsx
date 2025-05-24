import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { folderService } from '../api/folderService';
import { noteService } from '../api/noteService';
import type { Folder, Note } from '../types';
import { toast } from 'react-toastify';

const Notes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const currentFolderId = queryParams.get('folderId');

  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNoteName, setNewNoteName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const foldersData = await folderService.getFolders();
        setFolders(foldersData);

        if (currentFolderId) {
          try {
            const folderData = await folderService.getFolder(currentFolderId);
            setCurrentFolder(folderData);
            
            // Get notes for this folder
            const notesData = await noteService.getNotes();
            const filteredNotes = notesData.filter(note => note.folderId === currentFolderId);
            setNotes(filteredNotes);
          } catch (error) {
            console.error('Error fetching current folder:', error);
            toast.error('Folder not found');
            navigate('/notes');
          }
        } else {
          // If no folder is selected, show all notes
          const notesData = await noteService.getNotes();
          setNotes(notesData);
          setCurrentFolder(null);
        }
      } catch (error) {
        console.error('Error fetching notes data:', error);
        toast.error('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentFolderId, navigate]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNoteName.trim() || !currentFolderId) {
      toast.error('Note title cannot be empty and a folder must be selected');
      return;
    }
    
    try {
      const newNote = await noteService.createNote({
        folderId: currentFolderId,
        title: newNoteName,
        content: '',
      });
      
      setNotes([...notes, newNote]);
      setNewNoteName('');
      setShowNewNoteForm(false);
      toast.success('Note created successfully');
      
      // Navigate to the new note
      navigate(`/notes/${newNote.id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }
    
    try {
      const newFolder = await folderService.createFolder({
        name: newFolderName,
        parentId: currentFolderId || undefined,
      });
      
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowNewFolderForm(false);
      toast.success('Folder created successfully');
      
      // Navigate to the new folder
      navigate(`/notes?folderId=${newFolder.id}`);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const getBreadcrumbTrail = () => {
    if (!currentFolder) return null;
    
    return (
      <div className="breadcrumb">
        <Link to="/notes">All Notes</Link>
        {currentFolder && (
          <>
            <span> / </span>
            <span>{currentFolder.name}</span>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="notes-container">
      <header className="notes-header">
        <h1>{currentFolder ? currentFolder.name : 'All Notes'}</h1>
        {getBreadcrumbTrail()}
      </header>

      <div className="notes-content">
        <aside className="folders-sidebar">
          <div className="sidebar-header">
            <h2>Folders</h2>
            <button
              className="add-btn small"
              onClick={() => {
                setShowNewFolderForm(!showNewFolderForm);
                setShowNewNoteForm(false);
              }}
            >
              +
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
          
          <nav className="folders-nav">
            <ul>
              <li>
                <Link 
                  to="/notes" 
                  className={!currentFolderId ? 'active' : ''}
                >
                  All Notes
                </Link>
              </li>
              {folders.map((folder) => (
                <li key={folder.id}>
                  <Link 
                    to={`/notes?folderId=${folder.id}`}
                    className={currentFolderId === folder.id ? 'active' : ''}
                  >
                    {folder.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="notes-main">
          <div className="notes-actions">
            <button
              className="add-note-btn"
              onClick={() => {
                if (!currentFolderId) {
                  toast.error('Please select a folder first');
                  return;
                }
                setShowNewNoteForm(!showNewNoteForm);
                setShowNewFolderForm(false);
              }}
              disabled={!currentFolderId}
            >
              + New Note
            </button>
          </div>
          
          {showNewNoteForm && currentFolderId && (
            <form onSubmit={handleCreateNote} className="new-note-form">
              <input
                type="text"
                value={newNoteName}
                onChange={(e) => setNewNoteName(e.target.value)}
                placeholder="Enter note title"
                required
              />
              <button type="submit">Create</button>
            </form>
          )}
          
          <div className="notes-grid">
            {currentFolderId && notes.length === 0 ? (
              <div className="empty-state">
                <p>No notes in this folder yet. Create your first note to get started!</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="empty-state">
                <p>No notes yet. Select a folder and create your first note!</p>
              </div>
            ) : (
              notes.map((note) => (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notes;
