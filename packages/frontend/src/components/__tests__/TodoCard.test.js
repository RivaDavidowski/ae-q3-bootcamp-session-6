import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('Overdue Todo status', () => {
    const pastDueTodo = {
      id: 2,
      title: 'Past Due Task',
      dueDate: '2000-01-01',
      completed: 0,
      createdAt: '2000-01-01T00:00:00Z'
    };

    it('should render visible Overdue label and icon for incomplete past-due todo', () => {
      const { container } = render(<TodoCard todo={pastDueTodo} {...mockHandlers} isLoading={false} />);
      
      const overdueBadge = screen.getByText('Overdue');
      expect(overdueBadge).toBeInTheDocument();
      expect(overdueBadge).toBeVisible();

      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');

      // Check supplementary icon is aria-hidden
      const icon = container.querySelector('.overdue-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should preserve title, due date, checkbox, edit, and delete buttons for overdue todo', () => {
      render(<TodoCard todo={pastDueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText('Past Due Task')).toBeInTheDocument();
      expect(screen.getByText(/January 1, 2000/)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
      expect(screen.getByLabelText(/Edit "Past Due Task"/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Delete "Past Due Task"/)).toBeInTheDocument();
    });

    it('should not render Overdue label for completed past-due todo', () => {
      const completedPastDueTodo = { ...pastDueTodo, completed: 1 };
      const { container } = render(<TodoCard todo={completedPastDueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('should not render Overdue label for future-due todo', () => {
      const futureTodo = { ...mockTodo, dueDate: '2099-01-01' };
      const { container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('should update overdue status when props change via rerender (due date edit / completion toggle)', () => {
      const { rerender } = render(<TodoCard todo={pastDueTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();

      // Rerender with completed status = 1
      const updatedCompleted = { ...pastDueTodo, completed: 1 };
      rerender(<TodoCard todo={updatedCompleted} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

      // Rerender with future due date
      const updatedFuture = { ...pastDueTodo, completed: 0, dueDate: '2099-12-31' };
      rerender(<TodoCard todo={updatedFuture} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

      // Rerender back to past due date
      rerender(<TodoCard todo={pastDueTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });
  });
});
