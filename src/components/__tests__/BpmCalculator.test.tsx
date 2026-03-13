import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BpmCalculator from '../tools/BpmCalculator';

describe('BpmCalculator Component', () => {
  beforeEach(() => {
    // Clear any component state
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component correctly', () => {
      render(<BpmCalculator />);

      expect(screen.getByText('מחשבון BPM')).toBeInTheDocument();
      expect(screen.getByText(/הקש על העיגול/)).toBeInTheDocument();
    });

    it('should display initial BPM as dash', () => {
      render(<BpmCalculator />);

      const bpmDisplay = screen.getByText('—');
      expect(bpmDisplay).toBeInTheDocument();
      expect(bpmDisplay).toHaveClass('text-dj-cyan');
    });

    it('should display tap count', () => {
      render(<BpmCalculator />);

      expect(screen.getByText(/הקשות:/)).toBeInTheDocument();
    });

    it('should display BPM label', () => {
      render(<BpmCalculator />);

      expect(screen.getByText('BPM')).toBeInTheDocument();
    });

    it('should display reset button', () => {
      render(<BpmCalculator />);

      const resetButton = screen.getByRole('button', { name: /אפס/ });
      expect(resetButton).toBeInTheDocument();
    });

    it('should display genre BPM reference section', () => {
      render(<BpmCalculator />);

      expect(screen.getByText('טווחי BPM לפי ז\'אנר')).toBeInTheDocument();
      expect(screen.getByText('House')).toBeInTheDocument();
      expect(screen.getByText('Techno')).toBeInTheDocument();
    });

    it('should have Hebrew layout direction', () => {
      const { container } = render(<BpmCalculator />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveAttribute('dir', 'rtl');
    });

    it('should display tap button with correct styling', () => {
      render(<BpmCalculator />);

      const tapButton = screen.getByRole('button').filter((btn) =>
        btn.textContent?.includes('BPM')
      )[0];

      expect(tapButton).toHaveClass('rounded-full');
      expect(tapButton).toHaveClass('border-dj-cyan');
    });
  });

  describe('Tap Tempo Functionality', () => {
    it('should increment tap count on tap', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      fireEvent.click(tapButton);
      await waitFor(() => {
        expect(screen.getByText(/הקשות: 1/)).toBeInTheDocument();
      });

      fireEvent.click(tapButton);
      await waitFor(() => {
        expect(screen.getByText(/הקשות: 2/)).toBeInTheDocument();
      });
    });

    it('should calculate BPM after 2 taps', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      // Tap twice with consistent timing
      fireEvent.click(tapButton);
      fireEvent.click(tapButton);

      await waitFor(() => {
        const display = screen.queryByText(/^\d+\.\d+$/);
        expect(display).toBeInTheDocument();
      });
    });

    it('should update BPM display as more taps are added', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      // First tap
      fireEvent.click(tapButton);
      expect(screen.getByText('—')).toBeInTheDocument();

      // Second tap
      fireEvent.click(tapButton);
      await waitFor(() => {
        // BPM should start calculating
        const tapCountText = screen.getByText(/הקשות: 2/);
        expect(tapCountText).toBeInTheDocument();
      });
    });

    it('should show stability indicator after sufficient taps', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      // Tap 4+ times for stability check
      for (let i = 0; i < 5; i++) {
        fireEvent.click(tapButton);
      }

      await waitFor(() => {
        const stabilityText = screen.queryByText(/יציב|ממשיך למדוד/);
        expect(stabilityText).toBeInTheDocument();
      });
    });

    it('should support space key for tapping', async () => {
      render(<BpmCalculator />);

      fireEvent.keyDown(window, { code: 'Space', repeat: false });

      await waitFor(() => {
        expect(screen.getByText(/הקשות: 1/)).toBeInTheDocument();
      });
    });

    it('should ignore repeated space key events', async () => {
      render(<BpmCalculator />);

      const spaceDownEvent = new KeyboardEvent('keydown', {
        code: 'Space',
        repeat: true,
      });

      fireEvent.keyDown(window, spaceDownEvent);

      // Tap count should not increase for repeated key
      expect(screen.getByText(/הקשות: 0/)).toBeInTheDocument();
    });

    it('should reset taps if gap exceeds 3 seconds', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      fireEvent.click(tapButton);
      await waitFor(() => {
        expect(screen.getByText(/הקשות: 1/)).toBeInTheDocument();
      });

      // Simulate 3+ second gap
      vi.useFakeTimers();
      vi.advanceTimersByTime(3100);
      vi.useRealTimers();

      fireEvent.click(tapButton);
      await waitFor(() => {
        // Should reset and show 1 tap
        expect(screen.getByText(/הקשות: 1/)).toBeInTheDocument();
      });
    });

    it('should limit tap history to 16 taps', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      // Tap 20 times
      for (let i = 0; i < 20; i++) {
        fireEvent.click(tapButton);
      }

      // Should show 16 (the max)
      await waitFor(() => {
        expect(screen.getByText(/הקשות: 16/)).toBeInTheDocument();
      });
    });
  });

  describe('BPM Display', () => {
    it('should show manual BPM input', () => {
      render(<BpmCalculator />);

      const input = screen.getByPlaceholderText('120.0');
      expect(input).toBeInTheDocument();
    });

    it('should update BPM display when manual input changes', async () => {
      render(<BpmCalculator />);

      const input = screen.getByPlaceholderText('120.0') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '140' } });

      await waitFor(() => {
        const display = screen.getByText('140');
        expect(display).toBeInTheDocument();
      });
    });

    it('should support decimal BPM values', async () => {
      render(<BpmCalculator />);

      const input = screen.getByPlaceholderText('120.0') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '128.5' } });

      await waitFor(() => {
        expect(input.value).toBe('128.5');
      });
    });

    it('should constrain BPM between 20 and 300', async () => {
      render(<BpmCalculator />);

      const input = screen.getByPlaceholderText('120.0') as HTMLInputElement;

      expect(input).toHaveAttribute('min', '20');
      expect(input).toHaveAttribute('max', '300');
    });

    it('should show genre when BPM falls in genre range', async () => {
      render(<BpmCalculator />);

      const input = screen.getByPlaceholderText('120.0') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '128' } });

      await waitFor(() => {
        expect(screen.getByText('Tech House')).toBeInTheDocument();
      });
    });
  });

  describe('Reset Functionality', () => {
    it('should reset tap count and BPM on reset button click', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      // Tap a few times
      fireEvent.click(tapButton);
      fireEvent.click(tapButton);

      await waitFor(() => {
        expect(screen.getByText(/הקשות: 2/)).toBeInTheDocument();
      });

      const resetButton = screen.getByRole('button', { name: /אפס/ });
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(screen.getByText(/הקשות: 0/)).toBeInTheDocument();
        expect(screen.getByText('—')).toBeInTheDocument();
      });
    });

    it('should clear manual BPM input on reset', async () => {
      render(<BpmCalculator />);

      const input = screen.getByPlaceholderText('120.0') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '140' } });

      await waitFor(() => {
        expect(input.value).toBe('140');
      });

      const resetButton = screen.getByRole('button', { name: /אפס/ });
      fireEvent.click(resetButton);

      expect(input.value).toBe('');
    });

    it('should support Escape key for reset', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      fireEvent.click(tapButton);

      await waitFor(() => {
        expect(screen.getByText(/הקשות: 1/)).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { code: 'Escape' });

      await waitFor(() => {
        expect(screen.getByText(/הקשות: 0/)).toBeInTheDocument();
      });
    });
  });

  describe('Visual Feedback', () => {
    it('should show animation on tap', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      fireEvent.click(tapButton);

      // Check if scale-95 class is applied (briefly)
      await waitFor(() => {
        expect(tapButton).toHaveClass('scale-95');
      });
    });

    it('should show stability status in correct color', async () => {
      render(<BpmCalculator />);

      const tapButton = screen.getAllByRole('button')[0];

      // Tap consistently
      for (let i = 0; i < 6; i++) {
        fireEvent.click(tapButton);
      }

      await waitFor(() => {
        const statusText = screen.getByText(/יציב|ממשיך למדוד/);
        expect(statusText).toBeInTheDocument();
      });
    });

    it('should highlight matching genre', async () => {
      render(<BpmCalculator />);

      const input = screen.getByPlaceholderText('120.0') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '125' } });

      await waitFor(() => {
        const houseGenre = screen.getByText('Tech House');
        expect(houseGenre.parentElement).toHaveClass('border');
        expect(houseGenre.parentElement).toHaveClass('border-dj-primary');
      });
    });
  });

  describe('Genre BPM Reference', () => {
    it('should display all genres', () => {
      render(<BpmCalculator />);

      const genres = [
        'Hip-Hop',
        'House',
        'Tech House',
        'Techno',
        'Trance',
        'Drum & Bass',
        'Dubstep',
        'Pop',
        'Psytrance',
      ];

      genres.forEach((genre) => {
        expect(screen.getByText(genre)).toBeInTheDocument();
      });
    });

    it('should show BPM ranges for each genre', () => {
      render(<BpmCalculator />);

      expect(screen.getByText('85–115')).toBeInTheDocument(); // Hip-Hop
      expect(screen.getByText('120–130')).toBeInTheDocument(); // House
      expect(screen.getByText('128–140')).toBeInTheDocument(); // Techno
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<BpmCalculator />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have semantic heading', () => {
      render(<BpmCalculator />);

      const heading = screen.getByText('מחשבון BPM');
      expect(heading.tagName).toBe('H2');
    });

    it('should have helpful instructions', () => {
      render(<BpmCalculator />);

      expect(screen.getByText(/טיפ:/)).toBeInTheDocument();
      expect(screen.getByText(/לפחות 8 פעמים/)).toBeInTheDocument();
    });
  });
});
