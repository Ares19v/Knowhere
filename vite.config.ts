import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import os from 'os'

const homeDir = os.homedir();
const searchDirs = [
  path.join(homeDir, 'Desktop', 'Projects'),
  path.join(homeDir, 'Desktop', 'Other projects'),
  path.join(homeDir, 'Desktop', 'Other projects', 'dups')
];

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
        server.middlewares.use('/api/local-paths', (_req, res) => {
          const allFolders = searchDirs.flatMap(dir => getFolders(dir));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(allFolders));
        })
      }
    }
  ],
})
