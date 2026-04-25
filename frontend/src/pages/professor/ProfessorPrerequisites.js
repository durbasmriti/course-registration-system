import { useState } from 'react';
import { professorService } from '../../services/api';

export default function ProfessorPrerequisites() {
  const [course_id, setCourseId] = useState('');
  const [prereq_course_id, setPrereq] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await professorService.setPrerequisite(course_id, prereq_course_id);
      setMessage(`Recorded: ${prereq_course_id} is a prerequisite for ${course_id}.`);
      setPrereq('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submit failed.');
    }
  };

  return (
    <div className="content-panel">
      <h1 className="content-title">Prerequisites</h1>
      <p className="content-lead">Define that a course requires another course to have been completed (or cleared) before registration.</p>
      {message && <p className="panel-hint">{message}</p>}
      {error && <p className="panel-error">{error}</p>}
      <form className="stack-form" onSubmit={submit}>
        <label className="form-label">
          Course
          <input
            className="form-input"
            required
            value={course_id}
            onChange={(e) => setCourseId(e.target.value.toUpperCase())}
            placeholder="CE371"
          />
        </label>
        <label className="form-label">
          Prerequisite course
          <input
            className="form-input"
            required
            value={prereq_course_id}
            onChange={(e) => setPrereq(e.target.value.toUpperCase())}
            placeholder="CE361"
          />
        </label>
        <button type="submit" className="btn-primary">
          Add Prerequisite
        </button>
      </form>
    </div>
  );
}
