// GitHub raw URL base for admin-uploaded photos stored in the repo
export const GITHUB_REPO = 'AKking5120/Vidya_Coachings';
export const GITHUB_BRANCH = 'main';

export function getGithubImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.replace(/^\//, '');
  return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${encodeURI(cleanPath).replace(/%2F/g, '/')}`;
}

export function getLocalImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return '/' + path.replace(/^\//, '');
}
