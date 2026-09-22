import { useEffect, useState } from 'react';
import type { Workout } from '../backend';

interface WorkoutsProps {
  muscleLabel: string;
  workoutType: string;
  onBack: () => void;
  onRetry: () => void;
  workouts: Workout[];
  loading: boolean;
  error: string | null;
}

export default function Workouts({ workouts, loading, error, muscleLabel, workoutType, onBack, onRetry }: WorkoutsProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setFailedImages(new Set());
  }, [workouts]);

  const visibleWorkouts = workouts
    .map((workout, originalIndex) => ({ workout, originalIndex }))
    .filter(({ workout }) => !failedImages.has(workout.gifUrl));

  return (
    <main className="workouts-page">
      <button type="button" onClick={onBack}>← Change choices</button>
      <h1>{muscleLabel} workouts</h1>
      <p>Location: {workoutType === 'gym' ? 'Gym' : 'Home'}</p>
      {loading ? (
        <p role="status">Loading workouts…</p>
      ) : error ? (
        <div role="alert">
          <p>{error} Check that the backend is running on port 8080.</p>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      ) : (
        <>
          <p>{visibleWorkouts.length} workouts available.</p>
          {visibleWorkouts.length === 0 && (
            <p>{workouts.length === 0 ? 'No workouts found for these choices.' : 'No workouts with working images are available.'} Try another muscle group or location.</p>
          )}
          <div className="workouts-grid">
            {visibleWorkouts.map(({ workout, originalIndex }, index) => (
              <article className="workout" key={`${workout.gifUrl}-${originalIndex}`}>
                <h2>Workout {index + 1}</h2>
                <img
                  src={workout.gifUrl}
                  alt={`Exercise demonstration for ${workout.targetMuscles.join(', ')}`}
                  loading="lazy"
                  onError={() => {
                    setFailedImages((previous) => new Set(previous).add(workout.gifUrl));
                  }}
                  width={360}
                  height={360}
                />
                <p><strong>Body parts:</strong> {workout.bodyParts.join(', ')}</p>
                <p><strong>Target muscles:</strong> {workout.targetMuscles.join(', ')}</p>
                <p><a href={workout.gifUrl} target="_blank" rel="noreferrer">Open GIF</a></p>
                <h3>Instructions</h3>
                <ul>
                  {workout.instructions.map((instruction, step) => (
                    <li key={step}>{instruction}</li>
                  ))}
                </ul>
                <details>
                  <summary>Raw response</summary>
                  <pre>{JSON.stringify(workout, null, 2)}</pre>
                </details>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
