export interface Workout {
  bodyParts: string[];
  gifUrl: string;
  targetMuscles: string[];
  instructions: string[];
}

export async function getWorkouts(bodyParts: string, workoutType: string): Promise<Workout[]> {
  const workout = workoutType.trim().toLocaleLowerCase();
  const muscle = bodyParts.trim().toLowerCase();
  if (!muscle) throw new Error('A muscle group is required.');

  const response = await fetch('/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bodyParts: muscle, workoutType: workout }),
  });

  if (!response.ok) {
    throw new Error(`Workout request failed (${response.status})`);
  }

  return (await response.json()) as Workout[];
}
