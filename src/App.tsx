import React, { useState, useEffect } from "react";

//@ts-ignore
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage, { Project } from "./Projects"; // Import your HomePage component
import TasksPage from "./Tasks"; // Import your TasksPage component
import { parse } from "path";

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("taskTrackerData");
    if (data) {
      console.log(data)
      const parsedData = JSON.parse(data);
      console.log(parsedData)
      setProjects(parsedData.projects);
    }
    setInitialLoadCompleted(true);
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
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                loaded={initialLoadCompleted}
                setProjectsGlobally={setProjects}
                projectsGlobal={projects}
              />
            }
          />

          <Route
            path="/:id"
            element={
              <TasksPage
                loaded={initialLoadCompleted}
                setProjectsGlobally={setProjects}
                projects={projects}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
