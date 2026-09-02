/**
 * Date utility functions for local calendar date operations.
 */

/**
 * Parses a YYYY-MM-DD date string into a Date object set to local midnight.
 * Avoids UTC timezone conversion issues caused by native `new Date('YYYY-MM-DD')`.
 *
 * @param {string} dateString - Date string formatted as YYYY-MM-DD
 * @returns {Date|null} Date at local midnight, or null if invalid
 */
export function parseLocalDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return null;

  const match = dateString.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // 0-indexed month
  const day = parseInt(match[3], 10);

  const date = new Date(year, month, day, 0, 0, 0, 0);

  // Validate date values (e.g. check for invalid dates like Feb 30)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Normalizes a reference Date (defaults to current system time) to local midnight.
 *
 * @param {Date} [referenceDate=new Date()] - Reference date
 * @returns {Date} Date object set to local midnight
 */
export function getTodayLocalDate(referenceDate = new Date()) {
  const ref = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  return new Date(ref.getFullYear(), ref.getMonth(), ref.getDate(), 0, 0, 0, 0);
}

/**
 * Determines whether a todo is overdue relative to a reference date.
 * A todo is overdue if:
 * 1. It is not completed (completed is falsy or 0)
 * 2. It has a valid due date (YYYY-MM-DD)
 * 3. The due date (at local midnight) precedes today's local date (at local midnight)
 *
 * @param {Object} todo - Todo item
 * @param {Date} [referenceDate=new Date()] - Reference date for comparison
 * @returns {boolean} True if overdue, false otherwise
 */
export function isTodoOverdue(todo, referenceDate = new Date()) {
  if (!todo || todo.completed || !todo.dueDate) {
    return false;
  }

  const dueMidnight = parseLocalDate(todo.dueDate);
  if (!dueMidnight) {
    return false;
  }

  const todayMidnight = getTodayLocalDate(referenceDate);

  return dueMidnight.getTime() < todayMidnight.getTime();
}

/**
 * Formats a YYYY-MM-DD date string into a localized human-readable date.
 *
 * @param {string} dateString - Date string formatted as YYYY-MM-DD
 * @returns {string|null} Formatted date string or null if invalid
 */
export function formatDueDate(dateString) {
  const date = parseLocalDate(dateString);
  if (!date) return null;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
