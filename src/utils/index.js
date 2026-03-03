import Skills from "@/Pages/Skills";

export function createPageUrl(name) {
  const map = {
    Home: '/',
    Projects: '/projects',
    Skills: '/skills',
    About: '/about',
    Blog: '/blog',
    Contact: '/contact',
  };
  return map[name] ?? '/';
}
