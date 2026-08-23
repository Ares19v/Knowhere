import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const projectsDir = 'C:\\Users\\Devansh Tyagi\\Desktop\\Projects';
const otherProjectsDir = 'C:\\Users\\Devansh Tyagi\\Desktop\\Other projects';
const dupsDir = 'C:\\Users\\Devansh Tyagi\\Desktop\\Other projects\\dups';

function getFolders(dir: string) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({ name: dirent.name, path: path.join(dir, dirent.name), parent: dir }));
  } catch (e) {
    return [];
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-fs-api',
      configureServer(server) {
        server.middlewares.use('/api/local-paths', (req, res) => {
          const allFolders = [
            ...getFolders(projectsDir),
            ...getFolders(otherProjectsDir),
            ...getFolders(dupsDir)
          ];
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(allFolders));
        })
      }
    }
  ],
})
