import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from '../../components/UI/Button';

describe('Button Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>{component}</BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('should render button with text', () => {
      renderWithRouter(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render primary variant by default', () => {
      renderWithRouter(<Button>Primary</Button>);
      const button = screen.getByText('Primary').closest('button') || screen.getByText('Primary').closest('a');
      expect(button).toHaveClass('bg-gradient-to-b');
    });

    it('should render secondary variant', () => {
      renderWithRouter(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByText('Secondary').closest('button') || screen.getByText('Secondary').closest('a');
      expect(button).toHaveClass('bg-gradient-to-b');
    });

    it('should render outline variant', () => {
      renderWithRouter(<Button variant="outline">Outline</Button>);
      const button = screen.getByText('Outline').closest('button') || screen.getByText('Outline').closest('a');
      expect(button).toHaveClass('bg-transparent');
    });

    it('should render ghost variant', () => {
      renderWithRouter(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByText('Ghost').closest('button') || screen.getByText('Ghost').closest('a');
      expect(button).toHaveClass('bg-transparent');
    });

    it('should render shiny variant', () => {
      renderWithRouter(<Button variant="shiny">Shiny</Button>);
      const button = screen.getByText('Shiny').closest('button') || screen.getByText('Shiny').closest('a');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should render as NavLink when "to" prop is provided', () => {
      renderWithRouter(<Button to="/contact">Navigate</Button>);
      const link = screen.getByText('Navigate').closest('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/contact');
    });

    it('should render as button when no "to" prop', () => {
      renderWithRouter(<Button>Action</Button>);
      const button = screen.getByText('Action').closest('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      renderWithRouter(<Button onClick={handleClick}>Click</Button>);
      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      renderWithRouter(<Button disabled>Disabled</Button>);
      const button = screen.getByText('Disabled').closest('button');
      expect(button).toBeDisabled();
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      renderWithRouter(<Button disabled onClick={handleClick}>Disabled</Button>);
      fireEvent.click(screen.getByText('Disabled'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label when provided', () => {
      renderWithRouter(
        <Button ariaLabel="Close modal">X</Button>
      );
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should have type="button" by default', () => {
      renderWithRouter(<Button>Default</Button>);
      const button = screen.getByText('Default').closest('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should accept submit type', () => {
      renderWithRouter(<Button type="submit">Submit</Button>);
      const button = screen.getByText('Submit').closest('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Icons', () => {
    it('should show icon by default', () => {
      const { container } = renderWithRouter(<Button>With Icon</Button>
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should not show icon when icon prop is false', () => {
      const { container } = renderWithRouter(
        <Button icon={false}>No Icon</Button>
      );
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });
});
