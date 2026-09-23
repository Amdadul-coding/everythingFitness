import { useEffect, useRef, useState } from 'react';
import type { Workout } from '../backend';
import '../styles/welcome.css';
import '../styles/workouts.css';

interface WorkoutsProps {
  muscleLabel: string;
  workoutType: string;
  onBack: () => void;
  onRetry: () => void;
  workouts: Workout[];
  loading: boolean;
  error: string | null;
}

function WorkoutPreview({ workout, onError }: { workout: Workout; onError: () => void }) {
  return (
    <img src={workout.gifUrl} alt={`Exercise demonstration targeting ${workout.targetMuscles.join(', ')}`} loading="lazy" width={360} height={360} onError={onError} />
  );
}

function MuscleTags({ muscles }: { muscles: string[] }) {
  return <div className="workout-muscles" aria-label="Target muscles">{muscles.map((muscle, index) => <span key={`${muscle}-${index}`}>{muscle}</span>)}</div>;
}

function WorkoutDetails({ workout, name, onClose, onPreviewError }: { workout: Workout; name: string; onClose: () => void; onPreviewError: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog ref={dialog} className="workout-dialog" aria-labelledby="workout-dialog-title" onCancel={onClose} onClick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="workout-dialog-content">
        <button className="workout-dialog-close" type="button" onClick={onClose} aria-label="Close exercise steps" autoFocus>×</button>
        <div className="workout-dialog-preview"><WorkoutPreview workout={workout} onError={onPreviewError} /></div>
        <div className="workout-dialog-instructions">
          <p className="welcome-eyebrow">LET’S BREAK IT DOWN</p>
          <h2 id="workout-dialog-title">{name}</h2>
          <MuscleTags muscles={workout.targetMuscles} />
          <h3>How to do it</h3>
          {workout.instructions.length ? (
            <ol className="workout-steps">
              {workout.instructions.map((instruction, index) => <li key={index}>{instruction.replace(/^step\s*\d+\s*[:.)-]?\s*/i, '')}</li>)}
            </ol>
          ) : <p className="workout-muted">Instructions aren’t available for this exercise yet.</p>}
          <button className="welcome-submit" type="button" onClick={onClose}>Got it <span aria-hidden="true">✓</span></button>
        </div>
      </div>
    </dialog>
  );
}

export default function Workouts({ workouts, loading, error, muscleLabel, workoutType, onBack, onRetry }: WorkoutsProps) {
  const [selected, setSelected] = useState<{ workout: Workout; name: string } | null>(null);
  useEffect(() => { setSelected(null); }, [workouts, loading, error]);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  useEffect(() => { setFailedImages(new Set()); }, [workouts]);

  const visibleWorkouts = workouts
    .map((workout, originalIndex) => ({ workout, originalIndex }))
    .filter(({ workout }) => workout.gifUrl?.trim() && !failedImages.has(workout.gifUrl));

  function hideFailedPreview(gifUrl: string) {
    setFailedImages((previous) => new Set(previous).add(gifUrl));
    setSelected((previous) => previous?.workout.gifUrl === gifUrl ? null : previous);
  }


  return (
    <main className="workouts-page">
      <header className="welcome-header">
        <span className="welcome-brand"><span className="brand-mark" aria-hidden="true">ef.</span> Everything Fitness</span>
        <span className="welcome-header-note">A little movement. A good day.</span>
      </header>
      <div className="workouts-content">
        <button className="welcome-back" type="button" onClick={onBack}>← Change choices</button>
        <section className="workouts-intro" aria-labelledby="workouts-title">
          <div>
            <p className="welcome-eyebrow">YOUR FOCUS. YOUR PACE.</p>
            <h1 id="workouts-title">{muscleLabel} workouts<span>.</span></h1>
            <p className="workout-muted">Find your next move. Select a preview for the step-by-step guide.</p>
          </div>
          <span className="workout-location"><span aria-hidden="true">●</span> {workoutType === 'gym' ? 'At the gym' : 'At home'}</span>
        </section>
        {loading ? (
          <div role="status" className="workouts-state"><span className="workouts-loader" aria-hidden="true" /><h2>Finding your next moves…</h2><p>Getting your workout previews ready.</p></div>
        ) : error ? (
          <div role="alert" className="workouts-state"><h2>We couldn’t load your workouts.</h2><p>Please try again in a moment.</p><button className="welcome-submit" type="button" onClick={onRetry}>Try again <span aria-hidden="true">↻</span></button></div>
        ) : visibleWorkouts.length === 0 ? (
          <div className="workouts-state"><h2>No moves here just yet.</h2><p>Try another muscle group or workout location.</p><button className="welcome-submit" type="button" onClick={onBack}>Change choices <span aria-hidden="true">→</span></button></div>
        ) : (
          <>
            <div className="workouts-section-heading"><h2>Your exercise library</h2><span>{visibleWorkouts.length} {visibleWorkouts.length === 1 ? 'exercise' : 'exercises'}</span></div>
            <div className="workouts-grid">
              {visibleWorkouts.map(({ workout, originalIndex }) => {
                const name = workout.name?.trim() || `${muscleLabel} exercise ${originalIndex + 1}`;
                return (
                  <article className="workout-card" key={`${workout.gifUrl}-${originalIndex}`}>
                    <button className="workout-card-button" type="button" onClick={() => setSelected({ workout, name })} aria-label={`View steps for ${name}`} aria-haspopup="dialog">
                      <div className="workout-preview"><WorkoutPreview workout={workout} onError={() => hideFailedPreview(workout.gifUrl)} /><span className="workout-preview-link">View exercise <span aria-hidden="true">↗</span></span></div>
                      <div className="workout-card-info"><h3>{name}</h3><p>Target muscles</p><MuscleTags muscles={workout.targetMuscles.length ? workout.targetMuscles : [muscleLabel]} /></div>
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}
        <p className="welcome-footnote">One choice at a time. One workout at a time.</p>
      </div>
      {selected && <WorkoutDetails workout={selected.workout} name={selected.name} onPreviewError={() => hideFailedPreview(selected.workout.gifUrl)} onClose={() => setSelected(null)} />}
    </main>
  );
}
