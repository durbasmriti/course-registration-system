import { useEffect, useState } from 'react';
import { professorService } from '../../services/api';

export default function ProfessorPriorityRules({ user }) {
  const professorId = user?.externalId || user?.staffId || user?.userId;
  const [offerings, setOfferings] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [form, setForm] = useState({
    offering_id: '',
    weight_cpi: 1,
    weight_year: 0.1,
    weight_first_come: 0.01,
    weight_dept: 0.5,
    weight_major: 1,
    weight_minor: 0.6,
    weight_elective: 0.4,
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadOfferings = async () => {
      if (!professorId) {
        setLoadingCourses(false);
        return;
      }

      setLoadingCourses(true);
      try {
        const { data } = await professorService.getMyCourses(professorId);
        const list = Array.isArray(data) ? data : data?.courses ?? [];
        if (!cancelled) {
          setOfferings(list);
          if (list.length) {
            setForm((prev) => ({ ...prev, offering_id: String(list[0].offering_id) }));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Unable to load your courses.');
        }
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    };

    loadOfferings();

    return () => {
      cancelled = true;
    };
  }, [professorId]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!form.offering_id) {
      setError('Please select a course offering.');
      return;
    }

    const selectedOffering = offerings.find(
      (o) => String(o.offering_id) === String(form.offering_id)
    );

    if (!selectedOffering) {
      setError('Selected course offering is invalid.');
      return;
    }

    try {
      await professorService.setPriority(form.offering_id, {
        max_seats: Number(selectedOffering.max_seats || 0),
        rules: {
          cpi: Number(form.weight_cpi || 0),
          year: Number(form.weight_year || 0),
          dept: Number(form.weight_dept || 0),
          major: Number(form.weight_major || 0),
          minor: Number(form.weight_minor || 0),
          elective: Number(form.weight_elective || 0),
        },
      });
      setMessage('Priority rules saved to backend.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submit failed.');
    }
  };

  return (
    <div className="content-panel">
      <h1 className="content-title">Priority Rules</h1>
      <p className="content-lead">
        Weights for CPI, year, first-come, department match, and Major, Minor, or Elective intent. Used when computing priority scores.
      </p>
      {message && <p className="panel-hint">{message}</p>}
      {error && <p className="panel-error">{error}</p>}
      <form className="stack-form" onSubmit={submit}>
        <label className="form-label">
          Course offering
          <select
            className="form-input"
            required
            value={form.offering_id}
            onChange={(e) => setForm({ ...form, offering_id: e.target.value })}
            disabled={loadingCourses || offerings.length === 0}
          >
            <option value="">Select course</option>
            {offerings.map((o) => (
              <option key={o.offering_id} value={o.offering_id}>
                {o.course_code || o.course_id} - {o.title || o.course_name || o.name}
              </option>
            ))}
          </select>
        </label>
        <div className="form-grid-weights">
          {[
            ['weight_cpi', 'CPI'],
            ['weight_year', 'Year'],
            ['weight_first_come', 'First-Come'],
            ['weight_dept', 'Dept Match'],
            ['weight_major', 'Major Intent'],
            ['weight_minor', 'Minor Intent'],
            ['weight_elective', 'Elective Intent'],
          ].map(([key, label]) => (
            <label key={key} className="form-label">
              {label}
              <input
                className="form-input"
                type="number"
                step="0.01"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: parseFloat(e.target.value) || 0 })}
              />
            </label>
          ))}
        </div>
        <button type="submit" className="btn-primary">
          Save Rules
        </button>
      </form>
    </div>
  );
}
