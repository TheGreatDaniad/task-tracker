import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { Item } from "./Tasks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomModal, { Props as ModalProps } from "./Modal";
import { Link } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
type Props = {
  projectsGlobal: Project[];
  setProjectsGlobally: (projects: Project[]) => void;
  loaded: boolean;
};

export interface Project {
  id: number;
  name: string;
  items: Item[];
}

export default function Projects({
  setProjectsGlobally,
  projectsGlobal,
  loaded,
}: Props) {
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState<Project[]>(projectsGlobal);
  const [modal, setModal] = useState<ModalProps>();
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    if (loaded) {
      setProjectsGlobally(projects);
    }
  }, [projects]);
  useEffect(() => {
    if (loaded) {
      setProjects(projectsGlobal);
    }
  }, [loaded]);
  const handleAddProject = () => {
    if (newProjectName == "") return;
    const newProject: Project = {
      id: projects.length,
      name: newProjectName,
      items: [],
    };
    setProjects([...projects, newProject]);
    setNewProjectName("");
  };

  const calculateDoneSubTasks = (project: Project) => {
    const tasks = project.items;
    let count = 0;
    tasks.forEach((task) => {
      task.subItems.forEach((subItem) => {
        if (subItem.done) {
          count++;
        }
      });
    });
    return count;
  };
  const calculateAllSubTasks = (project: Project) => {
    const tasks = project.items;
    let count = 0;
    tasks.forEach((task) => {
      task.subItems.forEach((subItem) => {
        count++;
      });
    });
    return count;
  };
  const handleRemoveProject = (id: number) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
  };
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && addButtonRef.current) {
      addButtonRef.current.click();
    }
  };
  return (
    <div>
      <CustomModal
        title={modal?.title}
        description={modal?.description}
        initShow={showModal}
        setShow={setShowModal}
        handleConfirm={modal?.handleConfirm}
      />
      <Row className="text-center mt-4">
        <Col>
          <img src="logo.png" height={200} />
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col xs={8}>
          <div className="d-flex justify-content-between align-items-end ">
            <h2>Projects</h2>
          </div>
          <hr />
          {projects.length == 0 && (
            <p>You currently have no projects, add one to start.</p>
          )}
          {projects.map((project, index) => (
            <div key={project.id}>
              <div className="d-flex justify-content-between my-1">
                <div
                  title="click here to navigate to the project"
                  className=""
                  onClick={() => {}}
                >
                  <Link
                    to={project.id.toString()}
                    className="item-text d-inline font-weight-bold clickable no-decoration"
                  >
                    {project?.name}
                  </Link>
                  <small className="count mb-3"> ({project.items.length})</small>
                </div>

                <div className="d-inline">
                  {/* <button onClick={() => handleAddSubItem(item.id)}>
                    Add Subitem
                  </button>*/}

                  <FontAwesomeIcon
                    icon={faTrash}
                    title="click here to remove the project"
                    className="mx-3 clickable hover-bright trash"
                    onClick={() => {
                      setModal({
                        title: "Confirmation",
                        description:
                          "Are you sure you want to delete this project?",
                        initShow: true,
                        handleConfirm: () => {
                          handleRemoveProject(project.id);
                          setShowModal(false);
                        },
                      });
                      setShowModal(true);
                    }}
                  />
                  <span className="mx-3">
                    {calculateDoneSubTasks(project) +
                      "/" +
                      calculateAllSubTasks(project)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-10 d-flex justify-content-between">
            <input
              type="text"
              className="add-item-input"
              onKeyDownCapture={handleKeyPress}
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
            />
            <button
              className="add-item-btn"
              onClick={handleAddProject}
              ref={addButtonRef}
            >
              Add
            </button>
          </div>
        </Col>
        <Col />
      </Row>
    </div>
  );
}
