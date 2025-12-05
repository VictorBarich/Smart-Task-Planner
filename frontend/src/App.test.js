import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

test("test adding a task with successful backend POST", async () => {
  // Mock successful response for GET and POST
  // Attribution: ChatGPT helped with this complex mock of two request types
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (!options) { //GET
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { name: "Task that was fetched", description: "Example description", completed: false }
          ]),
        });
      }
      if (options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Successful post' }),
        });
      }
    });

  // Mock the alert function so we can detect when it is called
  window.alert = jest.fn();

  render(<TaskList />);

  // Except a task to be visible
  const demo_task = await screen.findByText(/Task that was fetched/i);
  expect(demo_task).toBeInTheDocument();

  // Attribution: ChatGPT aided in writing these lines which find and modify the textboxes and click the button
  const nameInput = screen.getByPlaceholderText('Write a letter');
  const descriptionInput = screen.getByPlaceholderText('Use a ballpoint pen...');
  const addButton = screen.getByRole('button', { name: /add/i });

  fireEvent.change(nameInput, { target: { value: 'Do homework' } });
  fireEvent.change(descriptionInput, { target: { value: 'Math exercises' } });
  fireEvent.click(addButton);

  // Wait for alert to be called
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Success: Successful post");
  });

  // Restore fetch and alert mocks
  jest.restoreAllMocks();
});

test("test adding a task with unsuccessful backend POST", async () => {
  // Mock successful response for GET; unsuccessful response for POST
  // Attribution: ChatGPT helped with this complex mock of two request types
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (!options) { //GET
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { name: "Task that was fetched", description: "Example description", completed: false }
          ]),
        });
      }
      if (options.method === 'POST') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        });
      }
    });

  // Mock the alert function so we can detect when it is called
  window.alert = jest.fn();

  render(<TaskList />);

  // Except a task to be visible
  const demo_task = await screen.findByText(/Task that was fetched/i);
  expect(demo_task).toBeInTheDocument();

  // Attribution: ChatGPT aided in writing these lines which find and modify the textboxes and click the button
  const nameInput = screen.getByPlaceholderText('Write a letter');
  const descriptionInput = screen.getByPlaceholderText('Use a ballpoint pen...');
  const addButton = screen.getByRole('button', { name: /add/i });

  fireEvent.change(nameInput, { target: { value: 'Do homework' } });
  fireEvent.change(descriptionInput, { target: { value: 'Math exercises' } });
  fireEvent.click(addButton);

  // Wait for alert to be called
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Error creating task");
  });

  // Restore fetch and alert mocks
  jest.restoreAllMocks();
});

test("test deleting a task with successful backend DELETE", async () => {
  // Patterned off of above test cases
  // Mock successful response from DELETE
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (options.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({message: "Task 'Wash the Dishes' deleted successfully"}),
        });
      }
    });

  // Mock the alert function so we can detect when it is called
  window.alert = jest.fn();

  render(<TaskList />);

  // Except a task to be visible
  const demo_task = await screen.findByText(/Wash the Dishes/i);
  expect(demo_task).toBeInTheDocument();

  const deleteButton = await screen.getAllByText(/Delete Task/i)[0]; // There will be multiple since there are multiple tasks, just choose the first one (Wash the Dishes)

  fireEvent.click(deleteButton);

  // Wait for alert to be called
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Success: Task 'Wash the Dishes' deleted successfully");
  });

  // Restore fetch and alert mocks
  jest.restoreAllMocks();
});

test("test deleting a task with unsuccessful backend DELETE", async () => {
  // Patterned off of above test cases
  // Mock unsuccessful response from DELETE
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (options.method === 'DELETE') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        });
      }
    });

  // Mock the alert function so we can detect when it is called
  window.alert = jest.fn();

  render(<TaskList />);

  // Except a task to be visible
  const demo_task = await screen.findByText(/Feed the Dog/i);
  expect(demo_task).toBeInTheDocument();

  // There will be multiple since there are multiple tasks, just choose the third one (index 2) (Feed the Dog)
  // This increases test coverage by deleting a completed task
  const deleteButton = await screen.getAllByText(/Delete Task/i)[2];

  fireEvent.click(deleteButton);

  // Wait for alert to be called
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Error deleting task. Note that task deletion is only available if connected to the backend.");
  });

  // Restore fetch and alert mocks
  jest.restoreAllMocks();
});