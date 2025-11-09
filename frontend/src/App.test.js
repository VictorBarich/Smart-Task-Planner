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

test("test adding a task with successful backend POST and successful duplication test", async () => {
  // Mock favorable response for GETs and POST
  // Attribution: ChatGPT helped with this complex mock of multiple request types
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (!options || options.method == 'GET') { //GET
        if (url == "http://localhost:8000/api/tasks/all") {
          // mock response for fetch all tasks
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              { name: "Task that was fetched", description: "Example description", completed: false }
            ]),
          });
        } else {
          // mock response for checking if a task is duplicate as if it is not
          return Promise.resolve(
            new Response(JSON.stringify({ detail: "Task not found" }), { status: 404 })
          );
        }
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

test("test adding a task with unsuccessful backend POST but successful duplication test", async () => {
  // Mock favorable response for GETs; unsuccessful response for POST
  // Attribution: ChatGPT helped with this complex mock of multiple request types
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (!options || options.method == 'GET') { //GET
        if (url == "http://localhost:8000/api/tasks/all") {
          // mock response for fetch all tasks
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              { name: "Task that was fetched", description: "Example description", completed: false }
            ]),
          });
        } else {
          // mock response for checking if a task is duplicate as if it is not
          return Promise.resolve(
            new Response(JSON.stringify({ detail: "Task not found" }), { status: 404 })
          );
        }
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

test("test adding a task with unsuccessful duplication test", async () => {
  // Mock unfavorable response from duplication GET;
  // Attribution: ChatGPT helped with this complex mock
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (!options || options.method == 'GET') { //GET
        if (url == "http://localhost:8000/api/tasks/all") {
          // This should not be queried for this test
        } else {
          // mock response for checking if a task is duplicate as if it is not
          return Promise.resolve(
            new Response(JSON.stringify({ task: "Task_name", description: "Task_description" }), { status: 200 })
          );
        }
      }
    });

  // Mock the alert function so we can detect when it is called
  window.alert = jest.fn();

  render(<TaskList />);

  // Except a demo task to be visible
  const demo_task = await screen.findByText(/Do the Laundry/i);
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
    expect(window.alert).toHaveBeenCalledWith("Error creating task: Task already exists.");
  });

  // Restore fetch and alert mocks
  jest.restoreAllMocks();
});