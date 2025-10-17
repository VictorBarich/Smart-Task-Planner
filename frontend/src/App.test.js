import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import App from './App';
import Task from './Task';
import TaskList from './TaskList';

test('main page renders tasks header', () => {
  render(<App />);
  const taskHeader = screen.getByText(/Tasks/i);
  expect(taskHeader).toBeInTheDocument();
});

test('Task renders passed in information', () => {
  render(<Task index={999} name={"TestABC"} completed={false} checkboxActionFunction={()=>{}}/>);
  const taskIndex = screen.getByText(/999./i);
  expect(taskIndex).toBeInTheDocument();
  const taskName = screen.getByText(/TestABC/i);
  expect(taskName).toBeInTheDocument();
});

test('Task checkbox executes action function when checked', async () => {
  var executed = false;

  const user = userEvent.setup();
  render(<Task index={999} name={"TestABC"} completed={false} checkboxActionFunction={()=>{executed = true}}/>);
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
  await user.click(checkbox);
  expect(checkbox).toBeChecked();
  expect(executed).toBe(true);
});

test('Test result of clicking all task checkboxes', async () => {
  const user = userEvent.setup();
  render(<TaskList />);
  const checkboxes = screen.getAllByRole('checkbox');
  for (const checkbox of checkboxes) {
    const checked = checkbox.checked;
    await user.click(checkbox);
    expect(checkbox.checked).toBe(!checked);
  }
});