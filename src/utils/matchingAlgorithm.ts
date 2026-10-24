import { StudentUser, LearningMatch, LearningMatchCycleNode } from '../types';

/**
 * Calculates availability overlap percentage between two students.
 */
function getAvailabilityOverlap(studentA: StudentUser, studentB: StudentUser): {
  score: number;
  overlappingDays: string[];
  overlappingSlots: string[];
} {
  const overlappingDays = studentA.availableDays.filter(day => 
    studentB.availableDays.includes(day)
  );

  const overlappingSlots = studentA.availableTimeSlots.filter(slot =>
    studentB.availableTimeSlots.includes(slot)
  );

  let score = 0;
  if (overlappingDays.length > 0) score += 40;
  if (overlappingDays.length > 1) score += 20;
  if (overlappingSlots.length > 0) score += 40;

  return {
    score: Math.min(score, 100),
    overlappingDays,
    overlappingSlots,
  };
}

/**
 * Checks if Student A can teach what Student B wants to learn.
 */
function findTeachingRelationship(teacher: StudentUser, learner: StudentUser): string | null {
  for (const teachSkill of teacher.skillsCanTeach) {
    const desired = learner.skillsWantToLearn.find(
      want => want.name.trim().toLowerCase() === teachSkill.name.trim().toLowerCase()
    );
    if (desired) {
      return teachSkill.name;
    }
  }
  return null;
}

/**
 * Runs the deterministic rule-based matching algorithm across student pool.
 * Detects:
 * 1) Direct 2-person swaps (A teaches B, B teaches A)
 * 2) 3-person circular learning cycles (A teaches B, B teaches C, C teaches A)
 */
export function computeSmartSkillMatches(
  currentStudent: StudentUser,
  allStudents: StudentUser[]
): LearningMatch[] {
  const matches: LearningMatch[] = [];
  const otherStudents = allStudents.filter(s => s.id !== currentStudent.id);

  // 1. Direct Pairwise Matches
  for (const peer of otherStudents) {
    const currentTeachesPeer = findTeachingRelationship(currentStudent, peer);
    const peerTeachesCurrent = findTeachingRelationship(peer, currentStudent);

    if (currentTeachesPeer && peerTeachesCurrent) {
      const avail = getAvailabilityOverlap(currentStudent, peer);
      const reasons: string[] = [
        `Direct 2-way skill swap: ${currentStudent.name} teaches ${currentTeachesPeer}, ${peer.name} teaches ${peerTeachesCurrent}`,
        avail.score > 50 
          ? `Availability overlaps on ${avail.overlappingDays.join(', ')}`
          : 'Compatible learning formats'
      ];

      const nodes: LearningMatchCycleNode[] = [
        {
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          studentAvatar: currentStudent.avatar,
          college: currentStudent.institution,
          teachesSkill: currentTeachesPeer,
          teachesToId: peer.id,
          teachesToName: peer.name,
          learnsSkill: peerTeachesCurrent,
          learnsFromId: peer.id,
          learnsFromName: peer.name,
        },
        {
          studentId: peer.id,
          studentName: peer.name,
          studentAvatar: peer.avatar,
          college: peer.institution,
          teachesSkill: peerTeachesCurrent,
          teachesToId: currentStudent.id,
          teachesToName: currentStudent.name,
          learnsSkill: currentTeachesPeer,
          learnsFromId: currentStudent.id,
          learnsFromName: currentStudent.name,
        }
      ];

      matches.push({
        id: `match-direct-${currentStudent.id}-${peer.id}`,
        type: 'direct',
        nodes,
        compatibilityScore: Math.round(75 + (avail.score * 0.25)),
        matchReasons: reasons,
        status: 'suggested',
      });
    }
  }

  // 2. 3-Person Circular Learning Cycles
  // Let A = currentStudent, iterate through candidate B and candidate C
  for (let i = 0; i < otherStudents.length; i++) {
    const peerB = otherStudents[i];
    for (let j = 0; j < otherStudents.length; j++) {
      if (i === j) continue;
      const peerC = otherStudents[j];

      // Check Cycle Direction:
      // A -> teaches B
      // B -> teaches C
      // C -> teaches A
      const aTeachesB = findTeachingRelationship(currentStudent, peerB);
      const bTeachesC = findTeachingRelationship(peerB, peerC);
      const cTeachesA = findTeachingRelationship(peerC, currentStudent);

      if (aTeachesB && bTeachesC && cTeachesA) {
        // Evaluate constraint compatibility
        const availAB = getAvailabilityOverlap(currentStudent, peerB);
        const availBC = getAvailabilityOverlap(peerB, peerC);
        const availCA = getAvailabilityOverlap(peerC, currentStudent);

        const avgAvail = (availAB.score + availBC.score + availCA.score) / 3;

        const sharedDays = currentStudent.availableDays.filter(d => 
          peerB.availableDays.includes(d) && peerC.availableDays.includes(d)
        );

        const reasons: string[] = [
          `Circular 3-Way Exchange: ${currentStudent.name} teaches ${aTeachesB} to ${peerB.name}, ${peerB.name} teaches ${bTeachesC} to ${peerC.name}, and ${peerC.name} teaches ${cTeachesA} to ${currentStudent.name}`,
          sharedDays.length > 0 
            ? `Common availability identified on: ${sharedDays.join(', ')}` 
            : `Compatible weekend/evening schedule slots`,
          `High mutual interest with verified student profiles`,
          `Zero-cost, voluntary peer learning cycle`
        ];

        const nodes: LearningMatchCycleNode[] = [
          {
            studentId: currentStudent.id,
            studentName: currentStudent.name,
            studentAvatar: currentStudent.avatar,
            college: currentStudent.institution,
            teachesSkill: aTeachesB,
            teachesToId: peerB.id,
            teachesToName: peerB.name,
            learnsSkill: cTeachesA,
            learnsFromId: peerC.id,
            learnsFromName: peerC.name,
          },
          {
            studentId: peerB.id,
            studentName: peerB.name,
            studentAvatar: peerB.avatar,
            college: peerB.institution,
            teachesSkill: bTeachesC,
            teachesToId: peerC.id,
            teachesToName: peerC.name,
            learnsSkill: aTeachesB,
            learnsFromId: currentStudent.id,
            learnsFromName: currentStudent.name,
          },
          {
            studentId: peerC.id,
            studentName: peerC.name,
            studentAvatar: peerC.avatar,
            college: peerC.institution,
            teachesSkill: cTeachesA,
            teachesToId: currentStudent.id,
            teachesToName: currentStudent.name,
            learnsSkill: bTeachesC,
            learnsFromId: peerB.id,
            learnsFromName: peerB.name,
          }
        ];

        matches.push({
          id: `cycle-${currentStudent.id}-${peerB.id}-${peerC.id}`,
          type: '3-way-cycle',
          nodes,
          compatibilityScore: Math.round(82 + (avgAvail * 0.16)),
          matchReasons: reasons,
          status: 'suggested',
        });
      }
    }
  }

  // Sort by compatibility score descending
  return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
