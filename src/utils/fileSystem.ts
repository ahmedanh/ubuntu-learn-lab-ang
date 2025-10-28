
// Interface for file system objects
interface FSItem {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FSItem>;
  permissions?: string;
  owner?: string;
  size?: number;
  modified?: Date;
}

export class FileSystem {
  private root: FSItem;
  private currentDir: FSItem;
  private currentPathSegments: string[];

  constructor() {
    // Initialize the file system with some default directories and files
    this.root = {
      name: '/',
      type: 'directory',
      children: {
        home: {
          name: 'home',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          modified: new Date(),
          children: {
            user: {
              name: 'user',
              type: 'directory',
              permissions: 'drwxr-xr-x',
              owner: 'user',
              modified: new Date(),
              children: {
                Documents: {
                  name: 'Documents',
                  type: 'directory',
                  permissions: 'drwxr-xr-x',
                  owner: 'user',
                  modified: new Date(),
                  children: {
                    'notes.txt': {
                      name: 'notes.txt',
                      type: 'file',
                      content: 'These are my Linux notes.',
                      permissions: '-rw-r--r--',
                      owner: 'user',
                      size: 24,
                      modified: new Date()
                    }
                  }
                },
                Downloads: {
                  name: 'Downloads',
                  type: 'directory',
                  permissions: 'drwxr-xr-x',
                  owner: 'user',
                  modified: new Date(),
                  children: {}
                },
                Pictures: {
                  name: 'Pictures',
                  type: 'directory',
                  permissions: 'drwxr-xr-x',
                  owner: 'user',
                  modified: new Date(),
                  children: {}
                },
                Videos: {
                  name: 'Videos',
                  type: 'directory',
                  permissions: 'drwxr-xr-x',
                  owner: 'user',
                  modified: new Date(),
                  children: {}
                },
                'tutorial.txt': {
                  name: 'tutorial.txt',
                  type: 'file',
                  content: 'Welcome to the Linux terminal tutorial!\nThis file contains information about basic commands.\n\n1. ls - List directory contents\n2. cd - Change directory\n3. pwd - Print working directory\n4. mkdir - Make directory\n5. rm - Remove files or directories',
                  permissions: '-rw-r--r--',
                  owner: 'user',
                  size: 187,
                  modified: new Date()
                }
              }
            }
          }
        }
      }
    };
    
    // Set the initial current directory to /home/user
    this.currentDir = this.root.children!.home.children!.user;
    this.currentPathSegments = ['/home/user'];
  }

  // Get the current working directory path
  get currentPath(): string {
    return this.currentPathSegments.join('/').replace(/\/\//g, '/');
  }

  // Change to a different directory
  changeDirectory(path: string): void {
    if (path === '..') {
      // Move up one directory
      if (this.currentPathSegments.join('/') !== '/home/user') {
        this.currentPathSegments.pop();
        this.currentDir = this.getDirectoryFromPath(this.currentPathSegments.join('/'));
      }
      return;
    }
    
    if (path === '~' || path === '/home/user') {
      this.navigateToHome();
      return;
    }
    
    // Handle absolute paths
    if (path.startsWith('/')) {
      const targetDir = this.getDirectoryFromPath(path);
      if (targetDir && targetDir.type === 'directory') {
        this.currentDir = targetDir;
        this.currentPathSegments = path.split('/').filter(Boolean);
        if (path === '/') {
          this.currentPathSegments = [''];
        }
      } else {
        throw new Error(`No such directory: ${path}`);
      }
      return;
    }
    
    // Handle relative paths
    const parts = path.split('/').filter(Boolean);
    let current = this.currentDir;
    
    for (const part of parts) {
      if (part === '..') {
        // Move up one directory
        if (this.currentPathSegments.join('/') !== '/home/user') {
          this.currentPathSegments.pop();
          current = this.getDirectoryFromPath(this.currentPathSegments.join('/'));
        }
      } else if (part === '.') {
        // Stay in current directory
        continue;
      } else {
        if (!current.children || !current.children[part]) {
          throw new Error(`No such directory: ${part}`);
        }
        
        const child = current.children[part];
        if (child.type !== 'directory') {
          throw new Error(`Not a directory: ${part}`);
        }
        
        current = child;
        this.currentPathSegments.push(part);
      }
    }
    
    this.currentDir = current;
  }

  // Navigate to the home directory
  navigateToHome(): void {
    this.currentDir = this.root.children!.home.children!.user;
    this.currentPathSegments = ['/home/user'];
  }

  // List the contents of the current directory
  listContents(detailed: boolean = false): string {
    if (!this.currentDir.children) {
      return '';
    }
    
    const contents = Object.values(this.currentDir.children);
    
    if (contents.length === 0) {
      return '';
    }
    
    if (detailed) {
      // Format for detailed listing
      return contents.map(item => {
        const dateStr = item.modified ? item.modified.toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }) : '';
        
        const size = item.size || (item.type === 'directory' ? 4096 : 0);
        
        return `${item.permissions || (item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--')} 1 ${item.owner || 'user'} ${item.owner || 'user'} ${size.toString().padStart(6, ' ')} ${dateStr} ${item.name}${item.type === 'directory' ? '/' : ''}`;
      }).join('\n');
    }
    
    // Simple listing format
    return contents.map(item => 
      `${item.name}${item.type === 'directory' ? '/' : ''}`
    ).join('  ');
  }

  // Create a new directory
  makeDirectory(name: string): void {
    if (!this.currentDir.children) {
      this.currentDir.children = {};
    }
    
    if (this.currentDir.children[name]) {
      throw new Error(`Cannot create directory '${name}': File exists`);
    }
    
    this.currentDir.children[name] = {
      name,
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: 'user',
      modified: new Date(),
      children: {}
    };
  }

  // Create a new file
  createFile(name: string): void {
    if (!this.currentDir.children) {
      this.currentDir.children = {};
    }
    
    if (this.currentDir.children[name]) {
      // Just update the timestamp if file exists
      if (this.currentDir.children[name].modified) {
        this.currentDir.children[name].modified = new Date();
      }
      return;
    }
    
    this.currentDir.children[name] = {
      name,
      type: 'file',
      content: '',
      permissions: '-rw-r--r--',
      owner: 'user',
      size: 0,
      modified: new Date()
    };
  }

  // Write content to a file
  writeToFile(name: string, content: string): void {
    if (!this.currentDir.children) {
      this.currentDir.children = {};
    }
    
    // Create the file if it doesn't exist
    if (!this.currentDir.children[name]) {
      this.createFile(name);
    }
    
    if (this.currentDir.children[name].type !== 'file') {
      throw new Error(`${name}: Is a directory`);
    }
    
    // Update file content
    this.currentDir.children[name].content = content;
    this.currentDir.children[name].size = content.length;
    this.currentDir.children[name].modified = new Date();
  }

  // Get content of a file
  getFileContent(name: string): string {
    if (!this.currentDir.children || !this.currentDir.children[name]) {
      throw new Error(`No such file: ${name}`);
    }
    
    const file = this.currentDir.children[name];
    if (file.type !== 'file') {
      throw new Error(`${name}: Is a directory`);
    }
    
    return file.content || '';
  }

  // Remove a file or directory
  remove(name: string, recursive: boolean = false): void {
    if (!this.currentDir.children || !this.currentDir.children[name]) {
      throw new Error(`No such file or directory: ${name}`);
    }
    
    const item = this.currentDir.children[name];
    
    if (item.type === 'directory' && !recursive) {
      throw new Error(`Cannot remove '${name}': Is a directory. Use -r flag for directories.`);
    }
    
    if (item.type === 'directory' && item.children && Object.keys(item.children).length > 0 && !recursive) {
      throw new Error(`Cannot remove '${name}': Directory not empty`);
    }
    
    delete this.currentDir.children[name];
  }

  // Search for files
  findFiles(path: string, pattern: string): string[] {
    let searchDir: FSItem;
    
    if (path === '.' || path === './') {
      searchDir = this.currentDir;
    } else {
      try {
        searchDir = this.getDirectoryFromPath(path);
      } catch {
        throw new Error(`${path}: No such directory`);
      }
    }
    
    if (searchDir.type !== 'directory') {
      throw new Error(`${path}: Not a directory`);
    }
    
    return this.searchInDirectory(searchDir, pattern, path === '.' ? '.' : path);
  }

  // Helper method to search in directory recursively
  private searchInDirectory(dir: FSItem, pattern: string, currentPath: string): string[] {
    if (!dir.children) return [];
    
    const results: string[] = [];
    
    for (const [name, item] of Object.entries(dir.children)) {
      const itemPath = `${currentPath === '.' ? '' : currentPath + '/'}${name}`;
      
      if (name.includes(pattern)) {
        results.push(itemPath);
      }
      
      if (item.type === 'directory' && item.children) {
        results.push(...this.searchInDirectory(item, pattern, itemPath));
      }
    }
    
    return results;
  }

  // Helper to get a directory from an absolute path
  private getDirectoryFromPath(path: string): FSItem {
    if (path === '/home/user' || path === '~') {
      return this.root.children!.home.children!.user;
    }
    
    if (path === '/') {
      return this.root;
    }
    
    const parts = path.split('/').filter(Boolean);
    let current = this.root;
    
    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        throw new Error(`No such directory: ${path}`);
      }
      
      current = current.children[part];
    }
    
    return current;
  }
}
