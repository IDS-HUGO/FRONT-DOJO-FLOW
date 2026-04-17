import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useApi } from '../hooks/useApi';
import { API_BASE_URL } from '../lib/api';
import { Student, Schedule } from '../types';

interface AttendanceRecord {
  student_id: number;
  present: boolean;
}

export function TeacherAttendancePage() {
  const { data: schedules = [], loading: schedulesLoading } = useApi<Schedule[]>('/schedules', { showAlert: false });
  const { data: students = [], loading: studentsLoading } = useApi<Student[]>('/students', { showAlert: false });
  
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Map<number, boolean>>(new Map());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const classStudents = students;

  const handleAttendanceToggle = (studentId: number) => {
    const newAttendance = new Map(attendance);
    newAttendance.set(studentId, !newAttendance.get(studentId));
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = async () => {
    if (!selectedSchedule) {
      setMessage({ type: 'error', text: 'Selecciona un horario' });
      return;
    }

    setSaving(true);
    try {
      const attendanceRecords: AttendanceRecord[] = classStudents.map(student => ({
        student_id: student.id,
        present: attendance.get(student.id) ?? false,
      }));

      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule_id: selectedSchedule,
          date: selectedDate,
          records: attendanceRecords,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Asistencia guardada exitosamente' });
        setAttendance(new Map());
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: '❌ Error al guardar asistencia' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error de conexión' });
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Array.from(attendance.values()).filter(Boolean).length;
  const absentCount = classStudents.length - presentCount;

  if (schedulesLoading || studentsLoading) {
    return (
      <div className="page page-shell">
        <PageHeader title="Registro de Asistencia" subtitle="Marca la asistencia de tus alumnos" />
        <div className="hero-empty surface-glass">
          <div className="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-shell">
      <PageHeader title="Registro de Asistencia" subtitle="Marca la asistencia de tus alumnos" />

      {/* Controls */}
      <div className="surface-glass" style={{ padding: '1.2rem', borderRadius: '1.2rem', marginBottom: '1.5rem' }}>
        <div className="form-row" style={{ marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: '500' }}>
              📚 Horario
            </label>
            <select 
              value={selectedSchedule ?? ''} 
              onChange={(e) => {
                setSelectedSchedule(e.target.value ? Number(e.target.value) : null);
                setAttendance(new Map());
              }}
              className="input-field"
              style={{ width: '100%' }}
            >
              <option value="">-- Selecciona un horario --</option>
              {schedules.map(schedule => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.class_type} - {schedule.start_time} a {schedule.end_time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: '500' }}>
              📅 Fecha
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {selectedSchedule && (
        <div className="executive-strip surface-glass">
          <div style={{ padding: '0.8rem' }}>
            <span className="executive-label">✅ Presentes</span>
            <strong style={{ fontSize: '1.8rem', color: '#10b981', marginTop: '0.3rem', display: 'block' }}>
              {presentCount}
            </strong>
          </div>
          <div style={{ padding: '0.8rem' }}>
            <span className="executive-label">❌ Ausentes</span>
            <strong style={{ fontSize: '1.8rem', color: '#ef4444', marginTop: '0.3rem', display: 'block' }}>
              {absentCount}
            </strong>
          </div>
          <div style={{ padding: '0.8rem' }}>
            <span className="executive-label">📊 Tasa Asistencia</span>
            <strong style={{ fontSize: '1.8rem', color: '#3b82f6', marginTop: '0.3rem', display: 'block' }}>
              {classStudents.length > 0 
                ? ((presentCount / classStudents.length) * 100).toFixed(1) 
                : 0}%
            </strong>
          </div>
        </div>
      )}

      {/* Students List */}
      {selectedSchedule ? (
        <div className="surface-glass" style={{ padding: '1.5rem', borderRadius: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--navy-deep)', fontSize: '1.1rem' }}>
              📋 Alumnos
            </h3>
            <span className="badge">{classStudents.length} alumnos</span>
          </div>

          {classStudents.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {classStudents.map(student => (
                <div 
                  key={student.id}
                  onClick={() => handleAttendanceToggle(student.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: `2px solid ${attendance.get(student.id) ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: attendance.get(student.id) ? '#f0fdf4' : '#ffffff',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = attendance.get(student.id) ? '#10b981' : '#e5e7eb';
                    e.currentTarget.style.backgroundColor = attendance.get(student.id) ? '#f0fdf4' : '#ffffff';
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={attendance.get(student.id) ?? false}
                    onChange={() => handleAttendanceToggle(student.id)}
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                      {student.full_name}
                    </strong>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {student.email}
                    </p>
                  </div>
                  <div>
                    {attendance.get(student.id) ? (
                      <span className="badge" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                        ✓ Presente
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                        ○ No marcado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="hero-empty">
              <p>No hay alumnos registrados</p>
            </div>
          )}

          {/* Message */}
          {message && (
            <div 
              className={`status-message ${message.type === 'error' ? 'status-message-error' : 'status-message-info'}`}
              style={{ marginTop: '1.5rem' }}
            >
              {message.text}
            </div>
          )}

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              onClick={handleSaveAttendance}
              disabled={saving || !selectedSchedule}
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1rem',
              }}
            >
              {saving ? '⏳ Guardando...' : '💾 Guardar Asistencia'}
            </button>
          </div>
        </div>
      ) : (
        <div className="hero-empty surface-glass" style={{ padding: '2rem', borderRadius: '1.2rem' }}>
          <p style={{ fontSize: '1rem', color: 'var(--muted)' }}>
            📌 Selecciona un horario para registrar asistencia
          </p>
        </div>
      )}
    </div>
  );
}