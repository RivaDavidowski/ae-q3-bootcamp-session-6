import { parseLocalDate, getTodayLocalDate, isTodoOverdue, formatDueDate } from '../dateUtils';

describe('dateUtils', () => {
  describe('parseLocalDate', () => {
    it('should parse YYYY-MM-DD into a Date object at local midnight', () => {
      const date = parseLocalDate('2026-09-01');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(8); // September is 0-indexed month 8
      expect(date.getDate()).toBe(1);
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
    });

    it('should return null for null, empty, or invalid date strings', () => {
      expect(parseLocalDate(null)).toBeNull();
      expect(parseLocalDate('')).toBeNull();
      expect(parseLocalDate('invalid-date')).toBeNull();
    });
  });

  describe('getTodayLocalDate', () => {
    it('should return a local midnight Date for today or given reference date', () => {
      const ref = new Date(2026, 8, 2, 15, 30, 0); // Sept 2, 2026 at 15:30
      const today = getTodayLocalDate(ref);
      expect(today.getFullYear()).toBe(2026);
      expect(today.getMonth()).toBe(8);
      expect(today.getDate()).toBe(2);
      expect(today.getHours()).toBe(0);
    });
  });

  describe('isTodoOverdue', () => {
    const referenceDate = new Date(2026, 8, 2, 10, 0, 0); // Sept 2, 2026

    it('should return true for incomplete past-due todo', () => {
      const todo = { id: 1, title: 'Past task', dueDate: '2026-09-01', completed: 0 };
      expect(isTodoOverdue(todo, referenceDate)).toBe(true);
    });

    it('should return false for due-today incomplete todo', () => {
      const todo = { id: 2, title: 'Today task', dueDate: '2026-09-02', completed: 0 };
      expect(isTodoOverdue(todo, referenceDate)).toBe(false);
    });

    it('should return false for future-due incomplete todo', () => {
      const todo = { id: 3, title: 'Future task', dueDate: '2026-09-03', completed: 0 };
      expect(isTodoOverdue(todo, referenceDate)).toBe(false);
    });

    it('should return false for undated incomplete todo', () => {
      const todo = { id: 4, title: 'Undated task', dueDate: null, completed: 0 };
      expect(isTodoOverdue(todo, referenceDate)).toBe(false);
    });

    it('should return false for completed past-due todo', () => {
      const todo = { id: 5, title: 'Completed past task', dueDate: '2026-09-01', completed: 1 };
      expect(isTodoOverdue(todo, referenceDate)).toBe(false);
    });

    it('should return false for completed boolean true todo', () => {
      const todo = { id: 6, title: 'Completed boolean task', dueDate: '2026-09-01', completed: true };
      expect(isTodoOverdue(todo, referenceDate)).toBe(false);
    });

    it('should become overdue when a due-today todo is evaluated on a later local date', () => {
      const todo = { id: 7, title: 'Borderline task', dueDate: '2026-09-02', completed: 0 };
      
      const sameDay = new Date(2026, 8, 2, 23, 59, 59); // Sept 2 late night
      expect(isTodoOverdue(todo, sameDay)).toBe(false);

      const nextDay = new Date(2026, 8, 3, 0, 0, 1); // Sept 3 early morning
      expect(isTodoOverdue(todo, nextDay)).toBe(true);
    });
  });

  describe('formatDueDate', () => {
    it('should format date string in readable format', () => {
      const formatted = formatDueDate('2026-09-01');
      expect(formatted).toBe('September 1, 2026');
    });

    it('should return null for invalid date', () => {
      expect(formatDueDate(null)).toBeNull();
      expect(formatDueDate('')).toBeNull();
    });
  });
});