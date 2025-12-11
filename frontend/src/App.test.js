import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import App from './App';
import Task from './Task';
import TaskList from './TaskList';
import { ToastContext, ToastProvider, useToast } from "./ToastContext";

// Attribution: ChatGPT helped with conversion from mocking alerts to mocking toasts

test('main page renders app logo', () => {
  render(<App />);
  const appLogo = screen.getByAltText(/Logo Image/i);
  expect(appLogo).toBeInTheDocument();
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
  render(<ToastProvider><Task index={999} name={"TestABC"} completed={false} checkboxActionFunction={() => { executed = true }} /></ToastProvider>);
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
  await user.click(checkbox);
  expect(executed).toBe(true);
});

test('Test result of clicking all task checkboxes', async () => {
  const user = userEvent.setup();
    const mockAddToast = jest.fn();

  render(<ToastProvider><TaskList /></ToastProvider>);
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

  render(<ToastProvider><TaskList /></ToastProvider>);

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

  render(<ToastProvider><TaskList /></ToastProvider>);

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

  // Mock the toast function so we can detect when it is called
  const mockAddToast = jest.fn();

  render(
    <ToastContext.Provider value={{ addToast: mockAddToast }}>
      <TaskList />
    </ToastContext.Provider>
  );

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
    expect(mockAddToast).toHaveBeenCalledWith("Success: Successful post", "success");
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

  // Mock the toast function so we can detect when it is called
  const mockAddToast = jest.fn();

  render(<ToastContext.Provider value={{ addToast: mockAddToast }}><TaskList /></ToastContext.Provider>);

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
    expect(mockAddToast).toHaveBeenCalledWith("Error creating task", "error");
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

  // Mock the toast function so we can detect when it is called
  const mockAddToast = jest.fn();

  render(<ToastContext.Provider value={{ addToast: mockAddToast }}><TaskList /></ToastContext.Provider>);
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
    expect(mockAddToast).toHaveBeenCalledWith("Error creating task: Task already exists or you may not be connected to the backend.", "error");
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
          json: () => Promise.resolve({ message: "Task 'Wash the Dishes' deleted successfully" }),
        });
      }
    });

  // Mock the toast function so we can detect when it is called
  const mockAddToast = jest.fn();

  render(<ToastContext.Provider value={{ addToast: mockAddToast }}><TaskList /></ToastContext.Provider>);
  // Except a task to be visible
  const demo_task = await screen.findByText(/Wash the Dishes/i);
  expect(demo_task).toBeInTheDocument();

  const deleteButton = await screen.getAllByText(/Delete/i)[0]; // There will be multiple since there are multiple tasks, just choose the first one (Wash the Dishes)

  fireEvent.click(deleteButton);

  // Wait for alert to be called
  await waitFor(() => {
    expect(mockAddToast).toHaveBeenCalledWith("Success: Task 'Wash the Dishes' deleted successfully", "success");
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

  // Mock the toast function so we can detect when it is called
  const mockAddToast = jest.fn();

  render(<ToastContext.Provider value={{ addToast: mockAddToast }}><TaskList /></ToastContext.Provider>);

  // Except a task to be visible
  const demo_task = await screen.findByText(/Feed the Dog/i);
  expect(demo_task).toBeInTheDocument();

  // There will be multiple since there are multiple tasks, just choose the third one (index 2) (Feed the Dog)
  // This increases test coverage by deleting a completed task
  const deleteButton = await screen.getAllByText(/Delete/i)[2];

  fireEvent.click(deleteButton);

  // Wait for alert to be called
  await waitFor(() => {
    expect(mockAddToast).toHaveBeenCalledWith("Error deleting task. Note that task deletion is only available if connected to the backend.", "error");
  });

  // Restore fetch and alert mocks
  jest.restoreAllMocks();
});

test("test changing task completion status with successful backend response", async () => {
  // Patterned off of above test cases
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (url == "http://localhost:8000/api/tasks/all") {
        // mock successful response for fetch all tasks
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { name: "Fetched Task", description: "Example description", completed: false }
          ]),
        });
      } else if (url == "http://localhost:8000/api/tasks/complete/Fetched Task") {
        // mock successful response for POST task 'Fetched Task' as complete
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(
            { "message": "Task 'Fetched Task' marked as complete" }
          ),
        });
      }
    });

  // Mock the toast function so we can detect when it is called
  const mockAddToast = jest.fn();

  const user = userEvent.setup();

  render(<ToastContext.Provider value={{ addToast: mockAddToast }}><TaskList /></ToastContext.Provider>);

  // Except a task to be visible
  const demo_task = await screen.findByText(/Fetched Task/i);
  expect(demo_task).toBeInTheDocument();

  const checkboxes = screen.getAllByRole('checkbox');
  await user.click(checkboxes[0]); // click the first checkbox (there should only be one), which corresponds to the task 'Fetchedn Task'
  expect(checkboxes[0].checked).toBe(true);

  // Wait for alert to be called
  await waitFor(() => {
    expect(mockAddToast).toHaveBeenCalledWith("Success: Task 'Fetched Task' marked as complete", "success");
  });

  // Restore fetch and alert mocks
  jest.restoreAllMocks();
});

test("test changing task completion status with unsuccessful backend response", async () => {
  // Patterned off of above test cases
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockImplementation((url, options) => {
      if (url == "http://localhost:8000/api/tasks/all") {
        // mock successful response for fetch all tasks
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { name: "Fetched Task", description: "Example description", completed: false }
          ]),
        });
      } else if (url == "http://localhost:8000/api/tasks/complete/Fetched Task") {
        // mock unsuccessful response for POST task 'Fetched Task' as complete
        return Promise.resolve({
          ok: false
        });
      }
    });

  // Mock the toast function so we can detect when it is called
  const mockAddToast = jest.fn();

  const user = userEvent.setup();

  render(<ToastContext.Provider value={{ addToast: mockAddToast }}><TaskList /></ToastContext.Provider>);

  // Except a task to be visible
  const demo_task = await screen.findByText(/Fetched Task/i);
  expect(demo_task).toBeInTheDocument();

  const checkboxes = screen.getAllByRole('checkbox');
  await user.click(checkboxes[0]); // click the first checkbox (there should only be one), which corresponds to the task 'Fetchedn Task'
  expect(checkboxes[0].checked).toBe(true);

  // Wait for alert to be called
  await waitFor(() => {
    expect(mockAddToast).toHaveBeenCalledWith("Task completion status change not retained. Note that retaining task completion status is only available if connected to the backend.", "error");
  });

  // Restore fetch and alert mocks
  jest.restoreAllMocks();
});

// Attribution: ChatGPT wrote this unit test for its Toast component with my oversight:
describe("ToastContext", () => {
  let originalDateNow;
  beforeAll(() => {
    originalDateNow = Date.now;
  });

  afterAll(() => {
    global.Date.now = originalDateNow;
  });

it("adds and removes toasts correctly", async () => {
  jest.useFakeTimers();
  const realDateNow = Date.now;
  let nextId = 1;
  global.Date.now = jest.fn(() => nextId++);

  const TestComponent = () => {
    const { addToast } = useToast();
    return (
      <>
        <button onClick={() => addToast("Hello")}>Add Toast</button>
        <button onClick={() => addToast("World")}>Add Second Toast</button>
      </>
    );
  };

  render(
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  );

  // Add first toast
  await act(async () => {
    fireEvent.click(screen.getByText("Add Toast"));
  });

  // Add second toast
  await act(async () => {
    fireEvent.click(screen.getByText("Add Second Toast"));
  });

  // At this point both toasts should exist
  expect(screen.getByText("Hello")).toBeInTheDocument();
  expect(screen.getByText("World")).toBeInTheDocument();

  // Fast-forward 3s → first toast should start leaving
  act(() => {
    jest.advanceTimersByTime(3000);
  });

  const leavingToast = document.querySelector(".toast-exit");
  expect(leavingToast).toBeInTheDocument();

  // Fast-forward 0.25s → first toast removed
  act(() => {
    jest.advanceTimersByTime(250);
  });

  expect(screen.queryByText("Hello")).toBeNull();

  // Fast-forward remaining 3.25s → second toast removed
  act(() => {
    jest.advanceTimersByTime(3250);
  });

  expect(screen.queryByText("World")).toBeNull();

  // Restore timers and Date.now
  jest.useRealTimers();
  global.Date.now = realDateNow;
});

});