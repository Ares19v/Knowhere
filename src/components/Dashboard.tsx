import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Folder, LogOut, Star, RefreshCw, Plus, Search, Palette, Pin, AlertTriangle, CheckSquare, Square, MapPin, Copy, Edit2, Check, Radar, Globe, Trash2 } from 'lucide-react';
import { autoOrganizeRepos } from '../utils/autoOrganize';
import Tilt from 'react-parallax-tilt';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Command } from 'cmdk';

const Dashboard = () => {
  const { 
    repositories, categories, isLoading, fetchRepositories, 
    updateRepoCategory, updateRepoCategoriesBulk, addCategory, 
    logout, geminiToken, pinnedRepos, togglePinRepo, theme, setTheme,
    updateRepoLocalPath, deleteCategory
  } = useStore();

  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || 'cat_1');
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);

  const [editingPathRepoId, setEditingPathRepoId] = useState<number | null>(null);
  const [editingPathValue, setEditingPathValue] = useState('');
  const [copiedPathRepoId, setCopiedPathRepoId] = useState<number | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [localFolders, setLocalFolders] = useState<{name: string, path: string, parent: string}[]>([]);

  useEffect(() => {
    if (activeCategoryId === 'track_everything') {
      fetch('/api/local-paths').then(res => res.json()).then(data => {
        setLocalFolders(data);
      }).catch(console.error);
    }
  }, [activeCategoryId]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  // Command Palette Keyboard Shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleDragStart = (e: React.DragEvent, repoId: number) => {
    if (selectedRepos.length > 0 && selectedRepos.includes(repoId)) {
      e.dataTransfer.setData('repoIds', JSON.stringify(selectedRepos));
    } else {
      e.dataTransfer.setData('repoIds', JSON.stringify([repoId]));
    }
  };

  const handleDrop = (e: React.DragEvent, categoryName: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('repoIds');
    if (data) {
      const repoIds = JSON.parse(data) as number[];
      updateRepoCategoriesBulk(repoIds, categoryName);
      setSelectedRepos([]); // clear selection
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleAutoOrganize = async () => {
    if (!geminiToken) {
      alert("Please add your Gemini API Key in the settings/setup to use Auto-Organize.");
      return;
    }
    const uncategorized = repositories.filter(r => r.category === 'Uncategorized');
    if (uncategorized.length === 0) return;

    setIsOrganizing(true);
    try {
      const results = await autoOrganizeRepos(uncategorized, categories.map(c => c.name), geminiToken);
      results.forEach(res => {
        updateRepoCategory(res.id, res.category);
      });
    } catch (error) {
      console.error(error);
      alert("Error organizing repositories.");
    } finally {
      setIsOrganizing(false);
    }
  };

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRepos(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    if (!activeCategoryId) return [];
    
    let baseRepos = repositories;
    if (activeCategoryId !== 'all' && activeCategoryId !== 'track_everything') {
      baseRepos = repositories.filter(repo => repo.category === activeCategory?.name);
    }

    return baseRepos.sort((a, b) => {
      const aPinned = pinnedRepos.includes(a.id);
      const bPinned = pinnedRepos.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [repositories, activeCategory, activeCategoryId, pinnedRepos]);

  const trackEverythingData = useMemo(() => {
    const projectsFolderRepos: any[] = [];
    const otherProjectsFolderRepos: any[] = [];
    const githubOnlyRepos: any[] = [];

    localFolders.forEach(folder => {
      if (folder.name === 'dups') return;

      const githubRepo = repositories.find(r => r.name.toLowerCase() === folder.name.toLowerCase());
      const merged = githubRepo ? { ...githubRepo, matchedPath: folder.path } : { id: folder.path, name: folder.name, matchedPath: folder.path };

      if (folder.parent.includes('Other projects')) {
        otherProjectsFolderRepos.push(merged);
      } else if (folder.parent.endsWith('Projects')) {
        projectsFolderRepos.push(merged);
      }
    });

    repositories.forEach(repo => {
      const hasLocalMatch = localFolders.some(f => f.name.toLowerCase() === repo.name.toLowerCase() && f.name !== 'dups');
      if (!hasLocalMatch) {
        githubOnlyRepos.push(repo);
      }
    });

    return { projectsFolderRepos, otherProjectsFolderRepos, githubOnlyRepos };
  }, [repositories, localFolders]);

  // Tech Stack Analytics & Stats
  const analyticsData = useMemo(() => {
    let totalStars = 0;
    let needsLoveCount = 0;
    const counts: Record<string, number> = {};

    repositories.forEach(repo => {
      totalStars += repo.stargazers_count || 0;
      
      const needsLove = !repo.description || repo.description.length < 10 || (repo.stargazers_count || 0) === 0;
      if (needsLove) needsLoveCount++;

      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7); // top 7

    return { totalStars, needsLoveCount, topLanguages };
  }, [repositories]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <div style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', color: '#fff', fontWeight: 'bold' }}>
            GH
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Knowhere</h2>
        </div>

        <button 
          onClick={() => setCmdOpen(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--text-muted)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={16} /> Search</div>
          <kbd style={{ fontSize: '0.7rem', background: 'var(--bg-color)', padding: '2px 6px', borderRadius: '4px' }}>⌘K</kbd>
        </button>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div
            onClick={() => setActiveCategoryId('track_everything')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
              background: activeCategoryId === 'track_everything' ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
              color: activeCategoryId === 'track_everything' ? 'var(--accent-primary)' : 'var(--text-main)',
              border: activeCategoryId === 'track_everything' ? '1px solid var(--accent-primary)' : '1px solid transparent',
              marginBottom: '1.5rem', transition: 'all 0.2s', fontWeight: 600
            }}
          >
            <Radar size={18} /> Track Everything
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', padding: '0 0.5rem', fontWeight: 600 }}>Folders</div>
          
          <div
            onClick={() => setActiveCategoryId('all')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
              background: activeCategoryId === 'all' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeCategoryId === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
              borderLeft: activeCategoryId === 'all' ? `3px solid var(--text-main)` : '3px solid transparent',
              marginBottom: '0.25rem', transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🌍</span>
              <span style={{ fontWeight: 500 }}>All Repositories</span>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '10px' }}>{repositories.length}</span>
          </div>

          {categories.map(cat => {
            const count = repositories.filter(r => r.category === cat.name).length;
            const isActive = activeCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, cat.name)}
                onClick={() => setActiveCategoryId(cat.id)}
                onMouseEnter={() => setHoveredCategoryId(cat.id)}
                onMouseLeave={() => setHoveredCategoryId(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  borderLeft: isActive ? `3px solid ${cat.color}` : '3px solid transparent',
                  marginBottom: '0.25rem', transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{cat.emoji}</span>
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {hoveredCategoryId === cat.id && cat.name !== 'Uncategorized' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete the folder "${cat.name}"? Any repos inside will be moved to Uncategorized.`)) {
                          deleteCategory(cat.id);
                          if (activeCategoryId === cat.id) setActiveCategoryId(categories[0].id);
                        }
                      }}
                      style={{ color: 'var(--danger)', padding: '2px', background: 'transparent' }}
                      title="Delete Folder"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '10px' }}>{count}</span>
                </div>
              </div>
            );
          })}

          {isAddingCategory ? (
            <div style={{ padding: '0.5rem' }}>
              <input 
                autoFocus
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    addCategory(newCategoryName.trim());
                    setNewCategoryName('');
                    setIsAddingCategory(false);
                  } else if (e.key === 'Escape') setIsAddingCategory(false);
                }}
                onBlur={() => setIsAddingCategory(false)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--accent-primary)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                placeholder="Folder name..."
              />
            </div>
          ) : (
            <div 
              onClick={() => setIsAddingCategory(true)}
              style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <Plus size={16} /> Add Folder
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'cyberpunk' : 'dark')} style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '8px', color: 'var(--text-main)' }} title="Toggle Theme">
            <Palette size={16} />
          </button>
          <button onClick={logout} style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '8px', color: 'var(--danger)' }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
        
        {/* Header & Stats */}
        <div style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {activeCategoryId === 'track_everything' ? <><Radar size={32} /> Track Everything</> 
                  : activeCategoryId === 'all' ? <>🌍 All Repositories</>
                  : <>{activeCategory?.emoji} {activeCategory?.name}</>}
              </h1>
            </div>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{activeCategoryId === 'track_everything' ? `${trackEverythingData.projectsFolderRepos.length + trackEverythingData.otherProjectsFolderRepos.length + trackEverythingData.githubOnlyRepos.length} total items tracked` : `${filteredRepos.length} repositories`}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {activeCategory?.name === 'Uncategorized' && (
              <button 
                onClick={handleAutoOrganize}
                disabled={isOrganizing || filteredRepos.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px',
                  background: 'var(--accent-glow)', color: 'var(--accent-primary)', border: '1px solid var(--accent-border)',
                  fontWeight: 600, opacity: (isOrganizing || filteredRepos.length === 0) ? 0.5 : 1,
                  cursor: (isOrganizing || filteredRepos.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                <Sparkles size={16} /> {isOrganizing ? 'Organizing...' : 'Auto-Organize'}
              </button>
            )}
            
            <button 
              onClick={fetchRepositories}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            >
              <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* Repos Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          {activeCategoryId === 'track_everything' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}><Folder size={18} /> In 'Projects' Folder ({trackEverythingData.projectsFolderRepos.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {trackEverythingData.projectsFolderRepos.map(repo => (
                     <div key={repo.id} className="glass" style={{ padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                       <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{repo.name}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={repo.matchedPath}>{repo.matchedPath}</div>
                     </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}><Folder size={18} /> In 'Other Projects' Folder ({trackEverythingData.otherProjectsFolderRepos.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {trackEverythingData.otherProjectsFolderRepos.map(repo => (
                     <div key={repo.id} className="glass" style={{ padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                       <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{repo.name}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={repo.matchedPath}>{repo.matchedPath}</div>
                     </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}><Globe size={18} /> GitHub Only ({trackEverythingData.githubOnlyRepos.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {trackEverythingData.githubOnlyRepos.map(repo => (
                     <div key={repo.id} className="glass" style={{ padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', opacity: 0.7 }}>
                       <div style={{ fontWeight: 600 }}>{repo.name}</div>
                     </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <>


          {isLoading && repositories.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading repositories...</div>
          ) : (
            <motion.div 
              layout
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
            >
              <AnimatePresence>
                {filteredRepos.map(repo => {
                  const isPinned = pinnedRepos.includes(repo.id);
                  const isSelected = selectedRepos.includes(repo.id);
                  const needsLove = !repo.description || repo.description.length < 10 || (repo as any).stargazers_count === 0;

                  return (
                    <Tilt key={repo.id} tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.15} glareColor="var(--accent-primary)" glarePosition="all" glareBorderRadius="16px">
                      <motion.div
                        layoutId={repo.id.toString()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e as any, repo.id)}
                        className="glass"
                        style={{
                          padding: '1.5rem', borderRadius: '16px', cursor: 'grab', display: 'flex', flexDirection: 'column', position: 'relative',
                          border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'var(--accent-glow)' : 'var(--bg-secondary)'
                        }}
                        whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                        whileTap={{ cursor: 'grabbing', scale: 0.98 }}
                        onClick={(e) => e.shiftKey && toggleSelect(repo.id, e as any)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {repo.name}
                          </a>
                          <button onClick={(e) => { e.stopPropagation(); togglePinRepo(repo.id); }} style={{ color: isPinned ? 'var(--warning)' : 'var(--text-muted)' }}>
                            <Pin size={16} fill={isPinned ? 'var(--warning)' : 'none'} />
                          </button>
                        </div>

                        <p style={{ fontSize: '0.875rem', flex: 1, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {repo.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No description provided.</span>}
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {repo.language && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                              {repo.language}
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Star size={14} /> {(repo as any).stargazers_count || 0}
                          </div>
                          
                          {needsLove && (
                            <div title="Needs a README or Description" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)', marginLeft: 'auto', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                              <AlertTriangle size={12} /> Needs Love
                            </div>
                          )}
                        </div>

                        {/* Local Path Tracker */}
                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {editingPathRepoId === repo.id ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input 
                                autoFocus
                                value={editingPathValue}
                                onChange={e => setEditingPathValue(e.target.value)}
                                placeholder="e.g. C:\Projects\MyRepo"
                                style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--accent-primary)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                                onClick={e => e.stopPropagation()}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    updateRepoLocalPath(repo.id, editingPathValue);
                                    setEditingPathRepoId(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingPathRepoId(null);
                                  }
                                }}
                              />
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateRepoLocalPath(repo.id, editingPathValue); setEditingPathRepoId(null); }}
                                style={{ padding: '0.4rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                              ><Check size={14} /></button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                <MapPin size={14} style={{ flexShrink: 0 }} />
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={repo.localPath || 'No local path set'}>
                                  {repo.localPath || 'No local path set'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                                {repo.localPath && (
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      navigator.clipboard.writeText(repo.localPath!); 
                                      setCopiedPathRepoId(repo.id); 
                                      setTimeout(() => setCopiedPathRepoId(null), 2000); 
                                    }}
                                    style={{ padding: '0.25rem', borderRadius: '4px', background: 'var(--bg-tertiary)', color: copiedPathRepoId === repo.id ? '#10b981' : 'var(--text-main)' }}
                                    title="Copy Path"
                                  >
                                    {copiedPathRepoId === repo.id ? <Check size={14} /> : <Copy size={14} />}
                                  </button>
                                )}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setEditingPathValue(repo.localPath || ''); setEditingPathRepoId(repo.id); }}
                                  style={{ padding: '0.25rem', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-main)' }}
                                  title="Edit Path"
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Multi-select overlay hook */}
                        <div onClick={(e) => toggleSelect(repo.id, e)} style={{ position: 'absolute', top: '1rem', right: '2.5rem', cursor: 'pointer', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                           {isSelected ? <CheckSquare size={16} /> : <Square size={16} opacity={0.2} className="select-square" />}
                        </div>
                      </motion.div>
                    </Tilt>
                  );
                })}
              </AnimatePresence>
              
              {filteredRepos.length === 0 && !isLoading && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                  <Folder size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                  <p>No repositories in this folder.</p>
                </div>
              )}
            </motion.div>
          )}
          </>
          )}
        </div>
      </div>

      {/* Command Palette */}
      {cmdOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', zIndex: 100 }} onClick={() => setCmdOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <Command style={{ width: '100%' }}>
              <Command.Input autoFocus placeholder="Search repositories or switch folders..." style={{ width: '100%', padding: '1rem 1.5rem', fontSize: '1.1rem', border: 'none', borderBottom: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', outline: 'none' }} />
              <Command.List style={{ maxHeight: '300px', overflowY: 'auto', padding: '0.5rem' }}>
                <Command.Empty style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No results found.</Command.Empty>
                
                <Command.Group heading="Folders" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {categories.map(cat => (
                    <Command.Item 
                      key={cat.id} 
                      onSelect={() => { setActiveCategoryId(cat.id); setCmdOpen(false); }}
                      style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}
                    >
                      {cat.emoji} Switch to {cat.name}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Repositories" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  {repositories.map(repo => (
                    <Command.Item 
                      key={repo.id} 
                      onSelect={() => { 
                        const cat = categories.find(c => c.name === repo.category);
                        if(cat) setActiveCategoryId(cat.id);
                        setCmdOpen(false); 
                      }}
                      style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', color: 'var(--text-main)' }}
                    >
                      <div style={{ fontWeight: 500 }}>{repo.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>in {repo.category}</div>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .glass:hover .select-square { opacity: 0.5 !important; }
        [cmdk-item][data-selected="true"] { background: var(--bg-tertiary); }
      `}</style>
    </div>
  );
};

export default Dashboard;
