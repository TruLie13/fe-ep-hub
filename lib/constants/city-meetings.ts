/**
 * ISR / fetch revalidate for `/city-meetings` and Legistar proxies.
 * Keep in sync with `getCityMeetingsRevalidateSeconds()` and page `export const revalidate`.
 */

/** Quiet days — 15 minutes. */
export const CITY_MEETINGS_REVALIDATE_DEFAULT_SECONDS = 900;

/** Agenda Wednesday outside the noon publish window — 10 minutes. */
export const CITY_MEETINGS_REVALIDATE_AGENDA_DAY_SECONDS = 600;

/**
 * Agenda Wednesday during the clerk publish window (10:00–20:00 Denver) — 3 minutes.
 * Clerk targets noon; posting often slips later in the day.
 */
export const CITY_MEETINGS_REVALIDATE_AGENDA_WINDOW_SECONDS = 180;

/**
 * Agenda Wednesday after `EventAgendaFile` is already present — relax back toward default.
 */
export const CITY_MEETINGS_REVALIDATE_AGENDA_POSTED_SECONDS = 900;
