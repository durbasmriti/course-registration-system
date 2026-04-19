import React, { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null); 
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const { username, password } = credentials;
    if (username === password && ['student', 'professor', 'admin'].includes(username.toLowerCase())) {
      setUser({ role: username.toLowerCase(), name: username.toUpperCase() });
    } else {
      alert("Try: student, professor, or admin");
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-box">
          <img src="/logo_black.png" alt="IITK Logo" className="login-logo" 
               onError={(e) => e.target.src = "https://via.placeholder.com/100?text=LOGO"}/>
          <h2>Academic Portal</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Username" 
              autoComplete="off"
              onChange={e => setCredentials({...credentials, username: e.target.value})} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              onChange={e => setCredentials({...credentials, password: e.target.value})} 
            />
            <button type="submit">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
           <img src="/logo_white.png" alt="Logo" className="sidebar-logo-img" 
                onError={(e) => e.target.src = "https://via.placeholder.com/60?text=LOGO"}/>
           <p className="role-label">{user.role.toUpperCase()} PANEL</p>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active">Registration</div>
          <div className="nav-item" onClick={() => setUser(null)}>Logout</div>
        </nav>
      </aside>

      <main className="main-area">
        <header className="header">
          <div className="header-left">
            <img src="/logo_white.png" alt="IITK" className="header-logo-img" />
            <span className="portal-title" style={{marginLeft: '10px', fontWeight: '600'}}>Registration Portal</span>
          </div>
          <div className="header-right">
            <span>Welcome, <strong>{user.name}</strong></span>
          </div>
        </header>

        <section className="table-container">
          {user.role === 'student' && <StudentTable />}
          {user.role === 'professor' && <ProfessorTable />}
          {user.role === 'admin' && <AdminTable />}
        </section>
      </main>
    </div>
  );
}

// Simple Placeholder Components for Tables
const StudentTable = () => (
  <table className="data-table">
    <thead>
      <tr><th>S.No</th><th>Course ID</th><th>Course Name</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>CE371</td><td>Reinforced Concrete</td><td><b style={{color:'orange'}}>Pending</b></td></tr>
    </tbody>
  </table>
);

const ProfessorTable = () => (
    <table className="data-table">
      <thead><tr><th>Roll No</th><th>Name</th><th>CPI</th><th>Action</th></tr></thead>
      <tbody><tr><td>230029</td><td>Aayushman Kumar</td><td>9.2</td><td><button>Accept</button></td></tr></tbody>
    </table>
);

const AdminTable = () => (
    <div style={{textAlign:'center', padding: '50px'}}>
        <button style={{padding:'15px 30px', background: '#D32F2F', color: 'white', border:'none', borderRadius: '5px'}}>RUN ALLOCATION</button>
    </div>
);

export default App;