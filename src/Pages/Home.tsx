import { useEffect, useRef, useState } from 'react';
import { muscleGroups, type WorkoutSelection, type WorkoutType } from '../workoutOptions';
import '../styles/welcome.css';

interface HomeProps {
  onComplete: (selection: WorkoutSelection) => void;
  initialSelection: WorkoutSelection | null;
}

export default function Home({ onComplete, initialSelection }: HomeProps) {
  const [step, setStep] = useState<1 | 2>(initialSelection ? 2 : 1);
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(initialSelection?.workoutType ?? null);
  const [muscle, setMuscle] = useState(initialSelection?.bodyParts ?? '');
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  function chooseLocation(location: WorkoutType) {
    setWorkoutType(location);
    setStep(2);
  }

  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <span className="welcome-brand"><span className="brand-mark" aria-hidden="true">ef.</span> Everything Fitness</span>
        <span className="welcome-header-note">A little movement. A good day.</span>
      </header>

      <div className="welcome-content">
        <div className="welcome-progress" aria-label={`Step ${step} of 2`}>
          <span className="progress-segment is-complete" />
          <span className={`progress-segment ${step === 2 ? 'is-complete' : ''}`} />
          <span>{step} / 2</span>
        </div>

        <section key={step} className={`welcome-question ${step === 1 ? 'slide-back' : 'slide-forward'}`}>
          <p className="welcome-eyebrow">{step === 1 ? 'WELCOME TO YOUR NEXT WORKOUT' : `${workoutType === 'gym' ? 'GYM' : 'HOME'} IT IS. LET’S FIND YOUR FOCUS.`}</p>
          <h1 ref={heading} tabIndex={-1}>
            {step === 1 ? <>Pick the location you are working at</> : <>Pick what you will be<br />working on today?</>}
          </h1>

          {step === 1 ? (
            <div className="location-options">
              <button className="location-card" type="button" onClick={() => chooseLocation('gym')}>
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 24h18M6 19v10m36-10v10" /><rect x="9" y="13" width="6" height="22" rx="2" /><rect x="33" y="13" width="6" height="22" rx="2" /></svg>
                <span className="location-name">At the gym <span aria-hidden="true">↗</span></span>
              </button>
              <button className="location-card" type="button" onClick={() => chooseLocation('home')}>
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7 22 17-14 17 14M12 19v21h24V19M20 40V27h8v13" /></svg>
                <span className="location-name">At home <span aria-hidden="true">↗</span></span>
              </button>
            </div>
          ) : (
            <form onSubmit={(event) => {
              event.preventDefault();
              const selected = muscleGroups.find((group) => group.value === muscle);
              if (workoutType && selected) {
                onComplete({ workoutType, bodyParts: selected.value, muscleLabel: selected.label });
              }
            }}>
              <fieldset className="muscle-options">
                <legend className="visually-hidden">Choose one muscle group</legend>
                {muscleGroups.map((group) => (
                  <label className="muscle-option" key={group.value}>
                    <input type="radio" name="muscle" value={group.value} checked={muscle === group.value} onChange={() => setMuscle(group.value)} required />
                    <span>{group.label}</span>
                  </label>
                ))}
              </fieldset>
              <div className="welcome-actions">
                <button className="welcome-back" type="button" onClick={() => setStep(1)}>← Change location</button>
                <button className="welcome-submit" type="submit" disabled={!muscle}>Show my workouts <span aria-hidden="true">→</span></button>
              </div>
            </form>
          )}
        </section>
        <p className="welcome-footnote">One choice at a time. One workout at a time.</p>
      </div>
    </main>
  );
}
