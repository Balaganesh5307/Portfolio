export const getFileUrl = (pathStr: string | null | undefined): string => {
  if (!pathStr) return '#';
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;

  const cleanPath = pathStr.startsWith('/') ? pathStr : '/' + pathStr;

  // In local development, direct static / upload files to backend server
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return `http://localhost:5001${cleanPath}`;
  }

  return cleanPath;
};
