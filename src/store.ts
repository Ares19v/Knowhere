import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  topics: string[];
  updated_at: string;
  stargazers_count?: number;
  category: string; 
  localPath?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export type ThemeType = 'dark' | 'light' | 'cyberpunk';

interface AppState {
  githubToken: string;
  geminiToken: string;
  repositories: Repository[];
  categories: Category[];
  pinnedRepos: number[];
  theme: ThemeType;
  isLoading: boolean;
  
  setGithubToken: (token: string) => void;
  setGeminiToken: (token: string) => void;
  setRepositories: (repos: Repository[]) => void;
  updateRepoCategory: (repoId: number, category: string) => void;
  updateRepoCategoriesBulk: (repoIds: number[], category: string) => void;
  addCategory: (name: string, emoji?: string, color?: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateRepoLocalPath: (repoId: number, path: string) => void;
  togglePinRepo: (repoId: number) => void;
  setTheme: (theme: ThemeType) => void;
  setIsLoading: (loading: boolean) => void;
  fetchRepositories: () => Promise<void>;
  logout: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Uncategorized', emoji: '📥', color: 'var(--text-muted)' },
  { id: 'cat_2', name: 'Frontend', emoji: '🎨', color: '#3b82f6' },
  { id: 'cat_3', name: 'Backend', emoji: '⚙️', color: '#10b981' },
  { id: 'cat_4', name: 'AI/ML', emoji: '🤖', color: '#8b5cf6' },
  { id: 'cat_5', name: 'Weekend Projects', emoji: '✨', color: '#f59e0b' },
  { id: 'cat_6', name: 'Archived', emoji: '📦', color: '#6b7280' }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      githubToken: '',
      geminiToken: '',
      repositories: [],
      categories: DEFAULT_CATEGORIES,
      pinnedRepos: [],
      theme: 'dark',
      isLoading: false,

      setGithubToken: (token) => set({ githubToken: token }),
      setGeminiToken: (token) => set({ geminiToken: token }),
      setRepositories: (repos) => set({ repositories: repos }),
      
      updateRepoCategory: (repoId, category) => 
        set((state) => ({
          repositories: state.repositories.map(repo => 
            repo.id === repoId ? { ...repo, category } : repo
          )
        })),

      updateRepoCategoriesBulk: (repoIds, category) =>
        set((state) => ({
          repositories: state.repositories.map(repo => 
            repoIds.includes(repo.id) ? { ...repo, category } : repo
          )
        })),

      addCategory: (name, emoji = '📁', color = '#8b5cf6') => 
        set((state) => {
          if (state.categories.some(c => c.name === name)) return state;
          const newCat: Category = { id: `cat_${Date.now()}`, name, emoji, color };
          return { categories: [...state.categories, newCat] };
        }),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
        })),

      deleteCategory: (id) =>
        set((state) => {
          const categoryToDelete = state.categories.find(c => c.id === id);
          if (!categoryToDelete || categoryToDelete.name === 'Uncategorized') return state;
          
          return {
            categories: state.categories.filter(c => c.id !== id),
            repositories: state.repositories.map(repo => 
              repo.category === categoryToDelete.name ? { ...repo, category: 'Uncategorized' } : repo
            )
          };
        }),

      updateRepoLocalPath: (repoId, path) =>
        set((state) => ({
          repositories: state.repositories.map(repo => 
            repo.id === repoId ? { ...repo, localPath: path } : repo
          )
        })),

      togglePinRepo: (repoId) =>
        set((state) => {
          const isPinned = state.pinnedRepos.includes(repoId);
          return {
            pinnedRepos: isPinned 
              ? state.pinnedRepos.filter(id => id !== repoId)
              : [...state.pinnedRepos, repoId]
          };
        }),

      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },

      setIsLoading: (loading) => set({ isLoading: loading }),

      fetchRepositories: async () => {
        const { githubToken, repositories } = get();
        if (!githubToken) return;

        set({ isLoading: true });
        try {
          let allData: any[] = [];
          let page = 1;
          let hasMore = true;

          while (hasMore && page <= 5) { // Cap at 5 pages (500 repos) for safety
            const response = await fetch(`https://api.github.com/user/repos?per_page=100&sort=updated&page=${page}`, {
              headers: {
                Authorization: `token ${githubToken}`,
                Accept: 'application/vnd.github.v3+json',
              }
            });
            
            if (!response.ok) throw new Error('Failed to fetch repositories');
            
            const data = await response.json();
            allData = [...allData, ...data];
            
            if (data.length < 100) {
              hasMore = false;
            } else {
              page++;
            }
          }
          
          const newRepos: Repository[] = allData.map((repo: any) => {
            const existingRepo = repositories.find(r => r.id === repo.id);
            return {
              id: repo.id,
              name: repo.name,
              description: repo.description,
              language: repo.language,
              html_url: repo.html_url,
              topics: repo.topics || [],
              updated_at: repo.updated_at,
              stargazers_count: repo.stargazers_count || 0,
              category: existingRepo ? existingRepo.category : 'Uncategorized',
              localPath: existingRepo?.localPath,
            };
          });

          set({ repositories: newRepos });
        } catch (error) {
          console.error("Error fetching repositories:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => set({ githubToken: '', geminiToken: '', repositories: [], pinnedRepos: [] }),
    }),
    {
      name: 'knowhere-storage-v2', // bumped version to avoid migration issues
    }
  )
);
