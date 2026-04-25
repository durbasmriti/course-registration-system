/** Sidebar structure per role. Keys map to main-panel views in App.js */

export const STUDENT_MENU = [
  {
    id: 'Academics',
    items: [
      { key: 'add-drop-25262', label: 'Add/Drop (2025-26/2)', status: 'open' },
      { key: 'summer-25263', label: 'Summer Registration (2025-26/3)', status: 'open' },
      { key: 'hss-26271', label: 'HSS Management (2026-27/1)', status: 'closed' },
      { key: 'pre-reg-26271', label: 'Pre-Registration (2026-27/1)', status: 'open' },
    ],
  },
  {
    id: 'Personal',
    items: [
      { key: 'profile', label: 'Student Profile' },
    ],
  },
];

export const PROFESSOR_MENU = [
  {
    id: 'Courses',
    items: [
      { key: 'my-courses', label: 'My Courses', status: 'open' },
      { key: 'create-course', label: 'Create / Edit Course', status: 'open' },
    ],
  },
  {
    id: 'Registration',
    items: [
      { key: 'priority-rules', label: 'Priority Rules', status: 'open' },
      { key: 'prerequisites', label: 'Prerequisites', status: 'open' },
      { key: 'incoming-requests', label: 'Incoming Requests', status: 'open' },
    ],
  },
  {
    id: 'Personal',
    items: [
      { key: 'prof-profile', label: 'Instructor Profile' },
      { key: 'prof-password', label: 'Change Password' },
    ],
  },
];

export const ADMIN_MENU = [
  {
    id: 'Personal',
    items: [{ key: 'admin-password', label: 'Change Password' }],
  },
];

export const MENU_BY_ROLE = {
  student: STUDENT_MENU,
  professor: PROFESSOR_MENU,
  admin: ADMIN_MENU,
};

export function defaultMenuState(menuSections) {
  const open = {};
  menuSections.forEach((s, i) => {
    open[s.id] = i === 0;
  });
  const firstKey = menuSections[0]?.items[0]?.key ?? '';
  return { openDropdowns: open, selectedSub: firstKey };
}
