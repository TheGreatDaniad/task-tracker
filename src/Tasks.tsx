import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

import {
  faTrash,
  faCheck,
  faGreaterThan,
  faBackward,
  faBackwardStep,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import CustomModal, { Props as ModalProps } from "./Modal";
import { Project } from "./Projects";
export interface Item {
  id: number;
  text: string;
  subItems: SubItem[];
}
interface SubItem {
  text: string;
  done: boolean;
}
type Props = {
  loaded: boolean;
  projects: Project[];
  setProjectsGlobally: (projects: Project[]) => void;
};

export default function Projects({
  setProjectsGlobally,
  projects,
  loaded,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [newSubItem, setNewSubItem] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState<string>("");
  const [showSubItems, setShowSubItems] = useState<boolean[]>([]);
  const [modal, setModal] = useState<ModalProps>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [wrongId, setWrongId] = useState(false);
  const location = useLocation();
  let id = parseInt(location.pathname.substring(1));

  useEffect(() => {
    if (loaded) {
      if (id > projects.length - 1) {
        setWrongId(true);
      }
      setItems(projects[id].items);
      const len = projects[id]?.items.length;
      const arrayOfFalse = Array(len).fill(false);
      setShowSubItems(arrayOfFalse);
    }
  }, [loaded]);
  useEffect(() => {
    if (loaded && items.length > 0) {
      //@ts-ignore
      setProjectsGlobally((prev) => {
        const updatedProjects = [...prev]; // Create a new copy of projects

        updatedProjects[id].items = items;
        return updatedProjects;
      });
    }
  }, [items]);

  const handleAddItem = () => {
    if (newItemText == "") return;
    const newItem: Item = {
      id: items.length,
      text: newItemText,
      subItems: [],
    };
    setItems([...items, newItem]);
    setNewItemText("");
    setShowSubItems([...showSubItems, false]);
  };
  const handleRemoveItem = (itemId: number) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    setShowSubItems(showSubItems.slice(0, updatedItems.length));
  };

  const handleAddSubItem = (itemId: number) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            subItems: [
              ...item.subItems,
              { done: false, text: newSubItem[itemId] },
            ],
          }
        : item
    );
    setItems(updatedItems);
    setNewItemText("");
  };
  const toggleCheckSubItem = (itemIndex: number, subItemIndex: number) => {
    const updatedItems = [...items];
    const updatedSubItems = [...updatedItems[itemIndex].subItems];
    updatedSubItems[subItemIndex] = {
      ...updatedSubItems[subItemIndex],
      done: !updatedSubItems[subItemIndex].done,
    };
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      subItems: updatedSubItems,
    };
    setItems(updatedItems);
  };
  const removeSubItem = (itemIndex: number, subItemIndex: number) => {
    const updatedItems = [...items];
    const updatedSubItems = [...updatedItems[itemIndex].subItems];
    updatedSubItems.splice(subItemIndex, 1);
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      subItems: updatedSubItems,
    };
    setItems(updatedItems);
  };
  const arrowIconClass = (index: number) => {
    return showSubItems[index]
      ? "collapse-btn collapse-btn-rotate clickable hover-bright d-inline"
      : "collapse-btn clickable hover-bright d-inline";
  };

  const toggleSubItems = (itemId: number) => {
    setShowSubItems((prevShowSubItems) =>
      prevShowSubItems.map((show, index) => {
        return index === itemId ? !show : show;
      })
    );
  };

  const calculateProgress = (item: Item): number => {
    let finished: number = 0;
    let len: number = item.subItems?.length;
    if (len < 1) return 0;
    item.subItems.forEach((item) => {
      if (item.done) {
        finished++;
      }
    });
    return Math.floor(100 * (finished / len));
  };
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const addButtonRef2 = useRef<HTMLButtonElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && addButtonRef.current) {
      addButtonRef.current.click();
    }
  };

  const handleKeyPress2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && addButtonRef2.current) {
      addButtonRef2.current.click();
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
        <Col sm={1}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            title="click here to remove the task"
            className="mx-3 clickable hover-bright trash"
            onClick={() => {
              window.location.href = "/";
            }}
            style={{ fontSize: 35 }}
          />
        </Col>
        <Col>
          <img src="logo.png" height={200} />
        </Col>
        <Col sm={1}></Col>
      </Row>
      {wrongId && <div>This project does not exist</div>}
      {!wrongId && (
        <Row>
          <Col></Col>
          <Col xs={8}>
            <div className="d-flex justify-content-between align-items-end ">
              <h2>Tasks</h2>
            </div>
            <hr />
            {items.length == 0 && (
              <p>You currently have no tasks, add one to start.</p>
            )}
            {items.map((item, index) => (
              <div key={item.id}>
                <div className="d-flex justify-content-between my-1">
                  <div
                    title="click here to show the subtasks or add them"
                    className=""
                    onClick={() => {
                      toggleSubItems(item.id);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faGreaterThan}
                      // className="clickable hover-bright d-inline collapse-btn collapse-btn-rotate"
                      className={arrowIconClass(item.id)}
                    />{" "}
                    <p className="item-text d-inline font-weight-bold clickable">
                      {item?.text}
                    </p>
                  </div>
                  <div className="d-inline">
                    {/* <button onClick={() => handleAddSubItem(item.id)}>
                    Add Subitem
                  </button>*/}

                    <span className="mx-3">%{calculateProgress(item)}</span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      title="click here to remove the task"
                      className="mx-3 clickable hover-bright trash"
                      onClick={() => {
                        setModal({
                          title: "Confirmation",
                          description:
                            "Are you sure you want to delete this task?",

                          initShow: true,
                          handleConfirm: () => {
                            handleRemoveItem(item.id);
                            setShowModal(false);
                          },
                        });
                        setShowModal(true);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faCheck}
                      title="colored green if the task is completed"
                      className={`mx-3 clickable hover-bright ${
                        calculateProgress(item) == 100 ? "done" : ""
                      }`}
                    />
                  </div>
                </div>
                <Row>
                  <Col className="d-flex justify-content-start flex-column align-items-start ">
                    {showSubItems[index] && (
                      <div className="subitem ">
                        <ul>
                          {item.subItems.map((subItem, subIndex) => (
                            <li
                              key={subIndex}
                              className="d-flex justify-content-between "
                            >
                              {subItem.text}
                              <span>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  title="click here to remove the subtask"
                                  className="mx-3 clickable hover-bright trash"
                                  onClick={() => {
                                    removeSubItem(item.id, subIndex);
                                  }}
                                />
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  title="click here to set the status as done or undo it if it is already done"
                                  className={`mx-3 clickable hover-bright ${
                                    subItem.done ? "done" : ""
                                  }`}
                                  onClick={() => {
                                    toggleCheckSubItem(item.id, subIndex);
                                  }}
                                />
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4  d-flex justify-content-between">
                          <input
                            type="text"
                            className="add-item-input"
                            onChange={(e) =>
                              setNewSubItem((prev) => {
                                prev[index] = e.target.value;
                                return prev;
                              })
                            }
                            onKeyDownCapture={handleKeyPress2}
                            placeholder="Write the subtask to add"
                          />
                          <button
                            className="add-item-btn"
                            onClick={() => {
                              handleAddSubItem(index);
                            }}
                            ref={addButtonRef2}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
            <div className="mt-10 d-flex justify-content-between">
              <input
                type="text"
                onKeyDownCapture={handleKeyPress}
                className="add-item-input"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Write the task to add"
              />
              <button
                className="add-item-btn"
                onClick={handleAddItem}
                ref={addButtonRef}
              >
                Add Task
              </button>
            </div>
          </Col>
          <Col />
        </Row>
      )}
    </div>
  );
}
