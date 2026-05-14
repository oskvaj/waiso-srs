import { QuestionType } from "@/../generated/prisma";

export const PASSED_LEVEL = 5;
export const MAX_LEVEL = 10;

export const QUESTION_TYPE_VALUES = Object.values(QuestionType) as [
  QuestionType,
  ...QuestionType[],
];

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

export const SRS_INTERVALS_MS = [
  HOUR_MS, // Level 0: 1 hour (floor for failing/falling back to level 0)
  HOUR_MS, // Level 1: 1 hour
  8 * HOUR_MS, // Level 2: 8 hours
  DAY_MS, // Level 3: 1 day
  3 * DAY_MS, // Level 4: 3 days
  WEEK_MS, // Level 5: 1 week
  2 * WEEK_MS, // Level 6: 2 weeks
  4 * WEEK_MS, // Level 7: 4 weeks
  8 * WEEK_MS, // Level 8: 8 weeks
  16 * WEEK_MS, // Level 9: 16 weeks
  32 * WEEK_MS, // Level 10: 32 weeks
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
