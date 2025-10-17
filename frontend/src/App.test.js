import { render, screen } from '@testing-library/react';
import App from './App';
import Task from './Task';

test('main page renders tasks header', () => {
  render(<App />);
  const taskHeader = screen.getByText(/Tasks/i);
  expect(taskHeader).toBeInTheDocument();
});

test('Task renders passed in information', () => {
  render(<Task index={999} name={"TestABC"} completed={false} />);
  const taskIndex = screen.getByText(/999./i);
  expect(taskIndex).toBeInTheDocument();
  const taskName = screen.getByText(/TestABC/i);
  expect(taskName).toBeInTheDocument();
});
