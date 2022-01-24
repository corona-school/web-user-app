import { Subject } from '../types';

export function checkCoDuSubjectRequirements(subjects: Subject[]): boolean {
  // CoDu requires that one of Math, English, German is selected and that this
  // is taught in one of the grades 8 to 10
  const relevantSubjects = subjects.filter(
    (s) =>
      ['Mathematik', 'Deutsch', 'Englisch'].includes(s.name) &&
      s.minGrade <= 10 &&
      s.maxGrade >= 8
  );

  return relevantSubjects.length > 0;
}
