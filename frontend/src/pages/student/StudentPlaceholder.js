import { useEffect, useMemo, useState } from 'react';
import { studentService } from '../../services/api';

function profileValue(value, fallback = 'N/A') {
  if (value === undefined || value === null || value === '') return fallback;
  return value;
}

export default function StudentPlaceholder({ title, children, user }) {
  const [profile, setProfile] = useState(null);
  const userId = user?.externalId || user?.staffId || user?.userId || user?.rollNo;

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!userId) return;

      try {
        const response = await studentService.getStudentProfile(userId);
        if (active) {
          setProfile(response.data);
        }
      } catch (err) {
        console.error('Error loading student profile:', err);
        if (active) {
          setProfile(null);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [userId]);

  const profileRows = useMemo(() => [
    { label: 'Name', value: profileValue(profile?.name || user?.displayName || user?.name) },
    { label: 'Email', value: profileValue(profile?.email || user?.email) },
    { label: 'Roll number', value: profileValue(profile?.roll_no || user?.rollNo || user?.externalId) },
    { label: 'Branch', value: profileValue(profile?.department || user?.department || user?.branch) },
    { label: 'Program', value: profileValue(user?.program, 'B.Tech') },
    { label: 'Academic year', value: profileValue(profile?.academic_year || user?.academicYear || user?.academic_year) },
    { label: 'CPI', value: profileValue(profile?.cpi || user?.cpi) },
    { label: 'User ID', value: profileValue(profile?.user_id || user?.staffId || user?.externalId) },
  ], [profile, user]);

  return (
    <div className="content-panel student-profile-page">
      <section className="profile-hero">
        <div>
          <p className="profile-hero-kicker">Read only</p>
          <h1 className="content-title student-panel-title profile-title">{title}</h1>
          <p className="content-lead profile-lead">{children}</p>
        </div>
        <span className="profile-chip">Student record</span>
      </section>

      <section className="profile-card">
        <div className="profile-grid">
          {profileRows.map((item) => (
            <div key={item.label} className="profile-item">
              <span className="profile-label">{item.label}</span>
              <strong className="profile-value">{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <p className="panel-muted profile-note">This page is view only. Contact your department office for corrections.</p>
    </div>
  );
}
