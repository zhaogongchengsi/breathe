import chokidar from 'chokidar'

export function resolveWatchOptions(options?: any) {
  const { ignored = [], ...otherOptions } = options ?? {}

  const resolvedWatchOptions = {
    ignored: [
      '**/.git/**',
      '**/node_modules/**',
      '**/test-results/**', // Playwright
      ...(Array.isArray(ignored) ? ignored : [ignored]),
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ...otherOptions,
  }
  return resolvedWatchOptions
}

export interface WatchOption {
  cwd: string
  sep?: string
  onChange?: (path: string) => void
  onAdd?: (type: 'file' | 'dir', path: string) => void
  onDelete?: (type: 'file' | 'dir', path: string) => void
}

export function createWatcher(
  paths: string | string[],
  { cwd, onChange, onAdd, onDelete, sep = '/' }: WatchOption,
) {
  const watcher = chokidar.watch(paths, {
    cwd,
  })

  watcher
    .on('change', (path: string) => {
      onChange && onChange(path)
    })

    .on('addDir', (path) => {
      onAdd && onAdd('dir', path)
    })
    .on('unlinkDir', (path) => {
      onDelete && onDelete('dir', path)
    })
    .on('add', (path) => {
      //   watcher.add(path);
      onAdd && onAdd('file', path)
    })
    .on('unlink', (path) => {
      onDelete && onDelete('file', path)
    })

  return watcher
}
