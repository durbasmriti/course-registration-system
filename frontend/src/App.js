import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { MENU_BY_ROLE, defaultMenuState } from './config/menus';
import { attachAuthHeaders, clearAuthHeaders } from './services/api';

import StudentRegistrationFlow from './pages/student/StudentRegistrationFlow';
import StudentPlaceholder from './pages/student/StudentPlaceholder';

import ProfessorMyCourses from './pages/professor/ProfessorMyCourses';
import ProfessorCreateCourse from './pages/professor/ProfessorCreateCourse';
import ProfessorPriorityRules from './pages/professor/ProfessorPriorityRules';
import ProfessorPrerequisites from './pages/professor/ProfessorPrerequisites';
import ProfessorIncoming from './pages/professor/ProfessorIncoming';

import About from './pages/About';

const STUDENT_VIEWS = {
  'add-drop-25262': StudentRegistrationFlow,
  'summer-25263': StudentRegistrationFlow,
  'hss-26271': StudentRegistrationFlow,
  'pre-reg-26271': StudentRegistrationFlow,
  profile: ({ user }) => (
    <StudentPlaceholder title="Student Profile" user={user}>
      View your student information below.
    </StudentPlaceholder>
  ),
  about: About,
};

const PROFESSOR_VIEWS = {
  'my-courses': ProfessorMyCourses,
  'create-course': ProfessorCreateCourse,
  'priority-rules': ProfessorPriorityRules,
  prerequisites: ProfessorPrerequisites,
  'incoming-requests': ProfessorIncoming,
  'prof-profile': ({ user }) => (
    <StudentPlaceholder title="Instructor Profile" user={user} profileType="professor">
      Faculty contact and department information.
    </StudentPlaceholder>
  ),
  about: About,
};

const ADMIN_VIEWS = {
  about: About,
};

const ROLE_VIEWS = {
  student: STUDENT_VIEWS,
  professor: PROFESSOR_VIEWS,
  admin: ADMIN_VIEWS,
};

/** Sidebar sentinel when About is open — never matches a real menu section id */
const ABOUT_SECTION_ID = '__about__';

const SIDEBAR_WIDTH_DEFAULT = 320;
const SIDEBAR_WIDTH_MIN = 260;
const SIDEBAR_WIDTH_MAX = 560;

function App() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(null);

  const menuSections = useMemo(() => {
    if (!user) return [];
    return MENU_BY_ROLE[user.role];
  }, [user]);

  const [openDropdowns, setOpenDropdowns] = useState({});
  const [activeSection, setActiveSection] = useState('Academics');
  const [selectedSub, setSelectedSub] = useState('');
  /** Sidebar visible by default; menu button toggles open/closed */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidthPx, setSidebarWidthPx] = useState(SIDEBAR_WIDTH_DEFAULT);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const sidebarResizeRef = useRef({ startX: 0, startWidth: SIDEBAR_WIDTH_DEFAULT });

  useEffect(() => {
    if (!user) {
      clearAuthHeaders();
      return;
    }
    attachAuthHeaders(user);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const next = defaultMenuState(MENU_BY_ROLE[user.role]);
    setOpenDropdowns(next.openDropdowns);
    setSelectedSub(next.selectedSub);
    setActiveSection(MENU_BY_ROLE[user.role][0]?.id ?? 'Academics');
    setSidebarOpen(true);
  }, [user]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!isResizingSidebar) return undefined;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    const onMove = (e) => {
      const delta = e.clientX - sidebarResizeRef.current.startX;
      const w = sidebarResizeRef.current.startWidth + delta;
      setSidebarWidthPx(
        Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, Math.round(w))),
      );
    };
    const onUp = () => setIsResizingSidebar(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = prevUserSelect;
    };
  }, [isResizingSidebar]);

  const onSidebarResizePointerDown = (e) => {
    if (!sidebarOpen) return;
    e.preventDefault();
    sidebarResizeRef.current = { startX: e.clientX, startWidth: sidebarWidthPx };
    setIsResizingSidebar(true);
  };

  const toggleDropdown = (section) => {
    setOpenDropdowns((prev) => ({ ...prev, [section]: !prev[section] }));
    setActiveSection(section);
  };

  const selectMenuItem = (sectionId, key) => {
    setSelectedSub(key);
    setActiveSection(sectionId);
  };

  const selectAbout = () => {
    setSelectedSub('about');
    setActiveSection(ABOUT_SECTION_ID);
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordMode(true);
    setResetFeedback(null);
    setCredentials((c) => ({ ...c, password: '' }));
  };

  const handleBackToLogin = () => {
    setForgotPasswordMode(false);
    setResetFeedback(null);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const loginId = credentials.username.trim();
    if (!loginId) {
      setResetFeedback({ type: 'error', message: 'Please enter your login ID.' });
      return;
    }
    setForgotPasswordMode(false);
    setResetFeedback(null);
    setCredentials((c) => ({ ...c, password: '' }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error feedback
        setResetFeedback({
          type: 'error',
          message: data.message || 'Login failed. Please try again.',
        });
        return;
      }

      // Successful login - set user with data from API
      const apiUser = data.user;
      
      // Map API response to existing user structure
      setUser({
        role: apiUser.role,
        name: apiUser.name || apiUser.username,
        displayName: apiUser.name || apiUser.username,
        email: apiUser.email,
        rollNo: apiUser.roll_no || apiUser.faculty_id || apiUser.user_id,
        department: apiUser.department,
        branch: apiUser.department,
        academicYear: apiUser.academic_year,
        cpi: apiUser.cpi,
        program: apiUser.program || 'B.Tech',
        facultyId: apiUser.faculty_id,
        staffId: apiUser.user_id,
        externalId: apiUser.user_id,
        photoUrl: '/user-avatar.png',
        token: data.token, // Store token for API calls
      });

      // Clear credentials and feedback
      setCredentials({ username: '', password: '' });
      setResetFeedback(null);
    } catch (err) {
      setResetFeedback({
        type: 'error',
        message: 'Server error: ' + err.message,
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    clearAuthHeaders();
  };

  const MainPanel = user ? ROLE_VIEWS[user.role]?.[selectedSub] : null;

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-box">
          <img src="/logo_black.png" alt="" className="login-logo" />
          <h2>Course Registration Portal</h2>
          
          <form
            className="login-form"
            onSubmit={forgotPasswordMode ? handleResetPassword : handleLogin}
          >
            <input
              type="text"
              placeholder={forgotPasswordMode ? 'Login ID' : 'Username'}
              autoComplete={forgotPasswordMode ? 'off' : 'username'}
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            {!forgotPasswordMode && (
              <>
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />

              </>
            )}
            {forgotPasswordMode && (
              <div className="login-forgot-row">
                <button type="button" className="login-forgot-link" onClick={handleBackToLogin}>
                  Back to login
                </button>
              </div>
            )}
            {resetFeedback && resetFeedback.type === 'error' && (
              <p className="login-reset-feedback is-error" role="status">
                {resetFeedback.message}
              </p>
            )}
            <button type="submit">{forgotPasswordMode ? 'Reset password' : 'Login'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <main className="main-area">
        <aside
          id="app-sidebar"
          className={`sidebar ${sidebarOpen ? '' : 'sidebar--collapsed'} ${
            isResizingSidebar ? 'sidebar--resizing' : ''
          }`}
          style={{ width: sidebarOpen ? sidebarWidthPx : 0 }}
          aria-hidden={!sidebarOpen}
        >
            {sidebarOpen ? (
              <div
                className="sidebar-resize-handle"
                onMouseDown={onSidebarResizePointerDown}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize navigation panel"
              />
            ) : null}
            <div className="sidebar-header">
              <img src="/logo_white.png" alt="" className="sidebar-logo-img" />
              <p className="role-label">{user.role.toUpperCase()} panel</p>
            </div>

            <nav className="sidebar-nav">
              <div className="sidebar-nav-scroll">
                {menuSections.map((section) => (
                  <div key={section.id} className="menu-group">
                    <div
                      className={`nav-item ${
                        activeSection === section.id && selectedSub !== 'about' ? 'active' : ''
                      }`}
                      onClick={() => toggleDropdown(section.id)}
                      onKeyDown={(ev) => ev.key === 'Enter' && toggleDropdown(section.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <span>{section.id}</span>
                      <span className="arrow-icon">{openDropdowns[section.id] ? '⇩' : '⇨'}</span>
                    </div>
                    <div className={`sliding-menu ${openDropdowns[section.id] ? 'open' : ''}`}>
                      <div className="sub-menu">
                        {section.items.map((item) => (
                          <div
                            key={item.key}
                            className={`sub-item-header ${selectedSub === item.key ? 'selected' : ''}`}
                            onClick={() => selectMenuItem(section.id, item.key)}
                            onKeyDown={(ev) =>
                              ev.key === 'Enter' && selectMenuItem(section.id, item.key)
                            }
                            role="button"
                            tabIndex={0}
                          >
                            {item.label}
                            {item.status === 'open' && <span className="status-open">Open</span>}
                            {item.status === 'closed' && <span className="status-closed">Closed</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sidebar-nav-footer">
                <div
                  className={`nav-item ${selectedSub === 'about' ? 'active' : ''}`}
                  onClick={selectAbout}
                  onKeyDown={(ev) => ev.key === 'Enter' && selectAbout()}
                  role="button"
                  tabIndex={0}
                >
                  <span>About</span>
                </div>
              </div>
            </nav>
        </aside>

        <div className="main-column">
          <header className="header">
            <div className="header-left">
              <button
                type="button"
                className="header-menu-btn"
                onClick={() => setSidebarOpen((open) => !open)}
                aria-expanded={sidebarOpen}
                aria-controls="app-sidebar"
                aria-label="Toggle sidebar menu"
              >
                <svg className="header-menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
                  />
                </svg>
              </button>
            </div>
            <div className="header-right">
              {user.displayName && (user.rollNo || user.facultyId || user.staffId) ? (
                <div className="header-user">
                  <div className="header-avatar-wrap">
                    <img
                      src={user.photoUrl || '/user-avatar.png'}
                      alt=""
                      className="header-avatar"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="header-user-text">
                    <span className="header-user-name">{user.displayName}</span>
                    <span className="header-user-id">
                      {user.rollNo || user.facultyId || user.staffId}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="header-welcome">
                  Welcome, <strong>{user.name}</strong>
                </span>
              )}
              <button
                type="button"
                className="header-menu-btn"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <svg className="header-menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                  />
                </svg>
              </button>
            </div>
          </header>

          <section className="table-container">
            {MainPanel ? (
              <MainPanel user={user} viewKey={selectedSub} />
            ) : (
              <p className="panel-muted">Select a menu item.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
