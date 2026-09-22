export type WorkoutType = 'gym' | 'home';

export interface WorkoutSelection {
  workoutType: WorkoutType;
  bodyParts: string;
  muscleLabel: string;
}

// Values match the target muscle names accepted by the Go backend.
export const muscleGroups = [
  { value: 'chest', label: 'Chest' },
  { value: 'upper back', label: 'Upper back' },
  { value: 'lats', label: 'Lats' },
  { value: 'delts', label: 'Shoulders' },
  { value: 'biceps', label: 'Biceps' },
  { value: 'triceps', label: 'Triceps' },
  { value: 'forearms', label: 'Forearms' },
  { value: 'abs', label: 'Abs' },
  { value: 'quads', label: 'Quads' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'calves', label: 'Calves' },
  { value: 'abductors', label: 'Abductors' },
  { value: 'adductors', label: 'Adductors' },
  { value: 'traps', label: 'Traps' },
  { value: 'spine', label: 'Lower back' },
  { value: 'levator scapulae', label: 'Levator scapulae' },
  { value: 'serratus anterior', label: 'Serratus anterior' },
  { value: 'cardiovascular system', label: 'Cardio' },
];
