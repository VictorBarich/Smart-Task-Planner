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
  render(<Task index={999} name={"TestABC"} completed={false} checkboxActionFunction={() => { }} />);
  const taskIndex = screen.getByText(/999./i);
  expect(taskIndex).toBeInTheDocument();
  const taskName = screen.getByText(/TestABC/i);
  expect(taskName).toBeInTheDocument();
});

test('Task checkbox executes action function when checked', async () => {
  var executed = false;

  const user = userEvent.setup();
  render(<Task index={999} name={"TestABC"} completed={false} checkboxActionFunction={() => { executed = true }} />);
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
  await user.click(checkbox);
  expect(checkbox).toBeChecked();
  expect(executed).toBe(true);
});

test('Test result of clicking all task checkboxes', async () => {
  const user = userEvent.setup();
  render(<TaskList />);
  // Wait for loading to disappear and tasks to appear
  const task = await screen.findByText(/To-Do/i);
  const checkboxes = screen.getAllByRole('checkbox');
  for (const checkbox of checkboxes) {
    const checked = checkbox.checked;
    await user.click(checkbox);
    expect(checkbox.checked).toBe(!checked);
  }
});

test("task list from successful backend fetch", async () => {
  // Mock successful fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            name: "Task that was fetched",
            description: "Example description",
            completed: false
          }
        ]),
    })
  );

  render(<TaskList />);

  // Except a task to be visible
  const demo_task = await screen.findByText(/Task that was fetched/i);
  expect(demo_task).toBeInTheDocument();

  // Expect not to see connection warning
  expect(screen.queryByText(/Not connected to backend/i)).not.toBeInTheDocument();
});

test("task list shows demo task when fetch fails", async () => {
  // Mock failed fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () =>
        Promise.resolve([]),
    })
  );

  render(<TaskList />);

  // Except a demo task to be visible
  const demo_task = await screen.findByText(/Wash the Dishes/i);
  expect(demo_task).toBeInTheDocument();

  // Expect to see connection warning
  expect(screen.queryByText(/Not connected to backend/i)).toBeInTheDocument();
});