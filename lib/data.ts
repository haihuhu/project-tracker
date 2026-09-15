export const taskStatuses = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
] as const;

export type TaskStatus = (typeof taskStatuses)[number]['value'];

type NavRoute = {
  label: string;
  href: string;
};

export const navRoutes: NavRoute[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Projects',
    href: '/projects',
  },
  {
    label: 'Settings',
    href: '/settings',
  },
];
