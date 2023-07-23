import React, { useState, useEffect } from "react";

//@ts-ignore
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage, { Project } from "./Projects"; // Import your HomePage component
import TasksPage from "./Tasks"; // Import your TasksPage component

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("taskTrackerData");
    if (data) {
      const parsedData = JSON.parse(data);
      setProjects(parsedData.projects);
      setInitialLoadCompleted(true);
    }
  }, []);
  useEffect(() => {
    if (initialLoadCompleted) {
      saveToLocalStorage(projects);
    }
  }, [projects]);
  const saveToLocalStorage = (projects: Project[]) => {
    const data = {
      projects,
    };
    localStorage.setItem("taskTrackerData", JSON.stringify(data));
  };
  return (
    <div>
      {initialLoadCompleted && (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  setProjectsGlobally={setProjects}
                  projectsGlobal={projects}
                />
              }
            />

            <Route
              path="/:id"
              element={
                <TasksPage
                  setProjectsGlobally={setProjects}
                  projects={projects}
                />
              }
            />
          </Routes>
        </Router>
      )}
    </div>
  );
};

export default App;
