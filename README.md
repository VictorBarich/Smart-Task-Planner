Team 26


# Smart Task Planner
### Created By: Victor Barich, Evan Doubek, Nathaniel Dower, and Connor Magnuson

## Project Description
This project helps users organize their life by providig a task list enhanced and automatically prioritized by AI. Users able able to add, delete, and complete tasks with an intuitive React web interface meanwhile tasks are retained and priorized using a Python backend.

## Project Setup

### Starting the Backend

To begin, install Python on your system is it is not already installed.

`cd` into the `backend` directory and install the dependencies by running `pip install -r requriements.txt`. Note that `pip` may be called `pip3` on your machine depending on your Python installation and configuration.

If you would like to install the dependencies in a Python virtual environment, you can find instructions on doing so [here](https://www.w3schools.com/python/python_virtualenv.asp).

Next, follow the instructions in `backend/README.md` to create a secrets file with your AI api key.

Finally, start the backend by running `python main.py`. Note that `python` may be called `python3` on your machine depending on your Python installation and configuration. Note that you will need to keep this terminal window open to continue running the backend.

### Starting the Frontend

To begin, install npm on your machine if it is not already installed using the instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

`cd` into the `frontend` directory and run `npm i` to install the required dependencies.

Finally, start the frontend by running `npm run start`. The frontend should then be accessible at [http://localhost:3000](http://localhost:3000).


#### Running the Frontend Unit Tests

The frontend code has 100% test coverage. To run the tests, execute `npm test` and then press `a`. To receive a coverage report along with the test run, execute `npm test -- --coverage` and then press `a`.


### Connecting the Frontend and Backend

If the frontend and backend are running on the same machine, they should automatically connect. If the frontend is not connected to the backend, functionality will be limited and a warning will be shown to the user.