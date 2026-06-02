const LEARNER_KEY = 'soma_learner_count';
const TUTOR_KEY = 'soma_tutor_count';

export const getLearnerCount = () =>
  parseInt(localStorage.getItem(LEARNER_KEY) || '0', 10);

export const getTutorCount = () =>
  parseInt(localStorage.getItem(TUTOR_KEY) || '0', 10);

export const incrementLearnerCount = () =>
  localStorage.setItem(LEARNER_KEY, String(getLearnerCount() + 1));

export const incrementTutorCount = () =>
  localStorage.setItem(TUTOR_KEY, String(getTutorCount() + 1));

// Returns display string or null (show fallback) if < 10
export const formatLearnerStat = (count) =>
  count >= 10 ? `${count}+` : null;

export const formatTutorStat = (count) =>
  count >= 10 ? `${count}+` : null;
