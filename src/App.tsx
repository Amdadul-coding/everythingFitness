import { useEffect, useState } from 'react';
import Home from './Pages/Home.tsx';
import Workouts from './Pages/Workouts.tsx';
import { getWorkouts, type Workout } from './backend';
import type { WorkoutSelection } from './workoutOptions';

function WorkoutResults({ selection, onBack }: { selection: WorkoutSelection; onBack: () => void }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getWorkouts(selection.bodyParts, selection.workoutType)
      .then((data) => {
        if (active) setWorkouts(data);
      })
      .catch((error: unknown) => {
        if (active) setError(error instanceof Error ? error.message : 'Unable to load workouts.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [selection, attempt]);

  return <Workouts workouts={workouts} loading={loading} error={error} muscleLabel={selection.muscleLabel} workoutType={selection.workoutType} onBack={onBack} onRetry={() => setAttempt((value) => value + 1)} />;
}

export default function App() {
  const [selection, setSelection] = useState<WorkoutSelection | null>(null);
  const [showResults, setShowResults] = useState(false);

  if (showResults && selection) {
    return <WorkoutResults selection={selection} onBack={() => setShowResults(false)} />;
  }

  return <Home initialSelection={selection} onComplete={(nextSelection) => {
    setSelection(nextSelection);
    setShowResults(true);
  }} />;
}
