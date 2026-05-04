import { QuestionType } from "@/../generated/prisma";

export const PASSED_LEVEL = 5;
export const MAX_LEVEL = 10;

export const QUESTION_TYPE_VALUES = Object.values(QuestionType) as [
  QuestionType,
  ...QuestionType[],
];

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export const SRS_INTERVALS_MS = [
  HOUR_MS, // Level 0: 1 hour (floor for failing/falling back to level 0)
  HOUR_MS, // Level 1: 1 hour
  8 * HOUR_MS, // Level 2: 8 hours
  DAY_MS, // Level 3: 1 day
  3 * DAY_MS, // Level 4: 3 days
  7 * DAY_MS, // Level 5: 7 days
  14 * DAY_MS, // Level 6: 14 days
  30 * DAY_MS, // Level 7: 30 days
  60 * DAY_MS, // Level 8: 60 days
  120 * DAY_MS, // Level 9: 120 days
  240 * DAY_MS, // Level 10: 240 days
] as const;

export const SRS_INTERVALS_TEST_MS = [
  10 * 1000, // Level 0:  10s
  10 * 1000, // Level 1:  10s
  20 * 1000, // Level 2:  20s
  30 * 1000, // Level 3:  30s
  45 * 1000, // Level 4:  45s
  60 * 1000, // Level 5:  60s
  90 * 1000, // Level 6:  90s
  120 * 1000, // Level 7:  120s
  180 * 1000, // Level 8:  180s
  240 * 1000, // Level 9:  240s
  300 * 1000, // Level 10: 300s
] as const;

export const USE_TEST_SRS = false; // TODO: set to false for production
