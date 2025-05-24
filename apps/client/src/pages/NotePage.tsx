import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { noteService } from '../api/noteService';
import { aiService } from '../api/aiService';
import type { Note, Summary, Quiz } from '../types';
import { toast } from 'react-toastify';

const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [note, setNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      // Improved handling for missing note ID
      if (!id) {
        toast.error('Note ID is missing');
        navigate('/notes');
        return;
      }
      
      try {
        setLoading(true);
        const noteData = await noteService.getNote(id);
        
        // Guard against null or undefined note data
        if (!noteData) {
          throw new Error('Note not found');
        }
        
        setNote(noteData);
        setTitle(noteData.title || '');
        setContent(noteData.content || '');
        
        // Try to fetch existing summary and quiz
        try {
          const summaries = await aiService.getSummaries();
          // Ensure summaries is an array before using array methods
          const summariesArray = Array.isArray(summaries) ? summaries : [];
          const noteSummary = summariesArray.find(s => s.noteId === id);
          setSummary(noteSummary || null);
          
          const quizzes = await aiService.getQuizzes();
          // Ensure quizzes is an array before using array methods
          const quizzesArray = Array.isArray(quizzes) ? quizzes : [];
          const noteQuiz = quizzesArray.find(q => q.noteId === id);
          setQuiz(noteQuiz || null);
        } catch (error) {
          console.error('Error fetching AI content:', error);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Failed to load note');
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!id) return;
    
    try {
      setSaving(true);
      await noteService.updateNote(id, { title, content });
      
      // Update local state
      setNote(prev => prev ? { ...prev, title, content } : null);
      setEditMode(false);
      toast.success('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!id || !content) {
      toast.error('Note must have content to generate a summary');
      return;
    }
    
    try {
      setGeneratingSummary(true);
      const newSummary = await aiService.generateSummary(id);
      setSummary(newSummary);
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!id || !content) {
      toast.error('Note must have content to generate a quiz');
      return;
    }
    
    try {
      setGeneratingQuiz(true);
      const newQuiz = await aiService.generateQuiz(id);
      setQuiz(newQuiz);
      toast.success('Quiz generated successfully');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await noteService.deleteNote(id);
        toast.success('Note deleted successfully');
        navigate('/notes');
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading note...</div>;
  }

  if (!note) {
    return <div className="error">Note not found</div>;
  }

  return (
    <div className="note-page-container">
      <header className="note-header">
        <div className="breadcrumb">
          <Link to="/notes">Notes</Link> / {editMode ? 'Editing: ' : ''}{note.title || 'Untitled Note'}
        </div>
        
        <div className="note-actions">
          {editMode ? (
            <>
              <button 
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setEditMode(false);
                  setTitle(note.title || '');
                  setContent(note.content || '');
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                className="edit-btn"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={handleDeleteNote}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </header>

      <div className="note-content-container">
        <main className="note-main">
          {editMode ? (
            <div className="note-editor">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
                className="title-input"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content..."
                className="content-input"
              />
            </div>
          ) : (
            <div className="note-viewer">
              <h1 className="note-title">{note.title || 'Untitled Note'}</h1>
              <div className="note-content">
                {note.content ? (
                  <div className="content-text">{note.content}</div>
                ) : (
                  <div className="empty-content">No content</div>
                )}
              </div>
            </div>
          )}
        </main>

        <aside className="note-sidebar">
          <section className="ai-tools">
            <h3>AI Tools</h3>
            
            <div className="tool-card">
              <h4>Generate Summary</h4>
              <p>Create a concise summary of your note content.</p>
              <button 
                className="tool-btn"
                onClick={handleGenerateSummary}
                disabled={generatingSummary || !note.content}
              >
                {generatingSummary ? 'Generating...' : 'Generate Summary'}
              </button>
              
              {summary && (
                <div className="summary-result">
                  <h5>Summary:</h5>
                  <div className="summary-content">{summary.gptResponse}</div>
                </div>
              )}
            </div>
            
            <div className="tool-card">
              <h4>Generate Quiz</h4>
              <p>Create practice questions based on your note.</p>
              <button 
                className="tool-btn"
                onClick={handleGenerateQuiz}
                disabled={generatingQuiz || !note.content}
              >
                {generatingQuiz ? 'Generating...' : 'Generate Quiz'}
              </button>
              
              {quiz && (
                <div className="quiz-result">
                  <h5>Quiz:</h5>
                  <div className="quiz-content">{quiz.gptResponse}</div>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default NotePage;
