import React, {
  useState,
  useEffect,
} from "react";

import "./index.css";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "./firebase";

function App() {
  /* STATES */

  const [projects, setProjects] =
    useState([]);

  const [projectName, setProjectName] =
    useState("");

  const [manager, setManager] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  /* REALTIME FIREBASE */

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "projects"
        ),

        (snapshot) => {
          const projectData =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setProjects(
            projectData
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  /* NOTIFICATIONS */

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    if (
      Notification.permission !==
      "granted"
    ) {
      return;
    }

    const now = new Date();

    projects.forEach((project) => {
      project.tasks?.forEach(
        (task) => {
          if (
            task.date &&
            !task.done
          ) {
            const taskDate =
              new Date(
                task.date
              );

            const diffHours =
              (taskDate -
                now) /
              (1000 *
                60 *
                60);

            const diffDays =
              diffHours / 24;

            if (
              diffDays >=
                0 &&
              diffDays <=
                3
            ) {
              new Notification(
                "🔴 Urgent Task",
                {
                  body: `${task.name} in ${project.name} is due soon`,
                }
              );
            }
          }
        }
      );
    });
  }, [projects]);

  /* PROJECT COLORS */

  const projectColors = [
    "#2563eb",
    "#7c3aed",
    "#dc2626",
    "#059669",
    "#ea580c",
  ];

  /* CREATE PROJECT */

  const createProject =
    async () => {
      if (!projectName)
        return;

      const newProject = {
        name: projectName,

        manager,

        deadline,

        tasks: [
          {
            name:
              "Dispatch",

            done: false,

            notes: "",

            date: "",
          },

          {
            name:
              "Delivery",

            done: false,

            notes: "",

            date: "",
          },

          {
            name:
              "Installation",

            done: false,

            notes: "",

            date: "",
          },

          {
            name:
              "Testing",

            done: false,

            notes: "",

            date: "",
          },
        ],
      };

      await addDoc(
        collection(
          db,
          "projects"
        ),

        newProject
      );

      setProjectName(
        ""
      );

      setManager("");

      setDeadline("");
    };

  /* SAVE PROJECT */

  const saveProject =
    async (
      projectId,
      updatedProject
    ) => {

      const projectRef =
        doc(
          db,
          "projects",
          projectId
        );

      await updateDoc(
        projectRef,
        updatedProject
      );
    };

  /* TOGGLE TASK */

  const toggleTask =
    async (
      projectIndex,
      taskIndex
    ) => {

      const updated = [
        ...projects,
      ];

      updated[
        projectIndex
      ].tasks[
        taskIndex
      ].done =
        !updated[
          projectIndex
        ].tasks[
          taskIndex
        ].done;

      setProjects(
        updated
      );

      await saveProject(
        updated[
          projectIndex
        ].id,

        updated[
          projectIndex
        ]
      );
    };

  /* UPDATE TASK */

  const updateTask =
    async (
      projectIndex,
      taskIndex,
      field,
      value
    ) => {

      const updated = [
        ...projects,
      ];

      updated[
        projectIndex
      ].tasks[
        taskIndex
      ][field] = value;

      setProjects(
        updated
      );

      await saveProject(
        updated[
          projectIndex
        ].id,

        updated[
          projectIndex
        ]
      );
    };

  /* ADD TASK */

  const addTask =
    async (
      projectIndex
    ) => {

      const updated = [
        ...projects,
      ];

      updated[
        projectIndex
      ].tasks.push({
        name:
          "New Task",

        done: false,

        notes: "",

        date: "",
      });

      setProjects(
        updated
      );

      await saveProject(
        updated[
          projectIndex
        ].id,

        updated[
          projectIndex
        ]
      );
    };

  /* DELETE LAST TASK */

  const deleteLastTask =
    async (
      projectIndex
    ) => {

      const updated = [
        ...projects,
      ];

      updated[
        projectIndex
      ].tasks.pop();

      setProjects(
        updated
      );

      await saveProject(
        updated[
          projectIndex
        ].id,

        updated[
          projectIndex
        ]
      );
    };

  /* COMPLETE PROJECT */

  const completeProject =
    async (
      projectIndex
    ) => {

      const confirmDelete =
        window.confirm(
          "Mark project as completed?"
        );

      if (
        !confirmDelete
      )
        return;

      const projectId =
        projects[
          projectIndex
        ].id;

      await deleteDoc(
        doc(
          db,
          "projects",
          projectId
        )
      );
    };

  return (
    <div className="app">
      {/* SIDEBAR */}

      <div className="sidebar">
        <h1 className="logo">
          PM Tool
        </h1>

        <div className="project-list">
          <p className="sidebar-title">
            Projects
          </p>

          {projects.map(
            (
              project,
              index
            ) => (
              <a
                key={
                  project.id
                }
                href={`#project-${index}`}
                className="project-btn"
              >
                {
                  project.name
                }
              </a>
            )
          )}
        </div>
      </div>

      {/* MAIN */}

      <div className="main">
        <h1>
          Dashboard
        </h1>

        <p className="subtitle">
          Project activity
          checklist
          system
        </p>

        {/* CREATE */}

        <div className="card create-card">
          <h2>
            Create Project
          </h2>

          <div className="form-row">
            <input
              className="input"
              placeholder="Project Name"
              value={
                projectName
              }
              onChange={(
                e
              ) =>
                setProjectName(
                  e.target
                    .value
                )
              }
            />

            <input
              className="input"
              placeholder="Project Manager"
              value={
                manager
              }
              onChange={(
                e
              ) =>
                setManager(
                  e.target
                    .value
                )
              }
            />

            <input
              className="input"
              type="date"
              value={
                deadline
              }
              onChange={(
                e
              ) =>
                setDeadline(
                  e.target
                    .value
                )
              }
            />

            <button
              className="create-btn"
              onClick={
                createProject
              }
            >
              Create
            </button>
          </div>
        </div>

        {/* PROJECTS */}

        {projects.map(
          (
            project,
            projectIndex
          ) => {

            const completedTasks =
              project.tasks?.filter(
                (
                  task
                ) =>
                  task.done
              ).length || 0;

            const progress =
              Math.round(
                (completedTasks /
                  project.tasks
                    .length) *
                  100
              );

            return (
              <div
                key={
                  project.id
                }
                id={`project-${projectIndex}`}
                className="project-card"
              >
                {/* HEADER */}

                <div
                  className="project-header"
                  style={{
                    background:
                      projectColors[
                        projectIndex %
                          projectColors.length
                      ],
                  }}
                >
                  <div>
                    <h1 className="project-title">
                      {
                        project.name
                      }
                    </h1>

                    <p>
                      Project
                      Manager:{" "}
                      {
                        project.manager
                      }
                    </p>

                    <p>
                      Deadline:{" "}
                      {
                        project.deadline
                      }
                    </p>
                  </div>

                  <div className="progress">
                    <h1>
                      {
                        progress
                      }
                      %
                    </h1>

                    <p>
                      Completed
                    </p>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* TASKS */}

                <div className="task-section">
                  <div className="task heading">
                    <strong>
                      Status
                    </strong>

                    <strong>
                      Task
                    </strong>

                    <strong>
                      Deadline
                    </strong>

                    <strong>
                      Notes
                    </strong>
                  </div>

                  {project.tasks?.map(
                    (
                      task,
                      taskIndex
                    ) => {

                      const today =
                        new Date();

                      const taskDate =
                        task.date
                          ? new Date(
                              task.date
                            )
                          : null;

                      let taskColor =
                        "#dcfce7";

                      let urgent =
                        false;

                      if (
                        taskDate &&
                        !task.done
                      ) {

                        const diffHours =
                          (taskDate -
                            today) /
                          (1000 *
                            60 *
                            60);

                        const diffDays =
                          diffHours /
                          24;

                        /* RED */

                        if (
                          diffDays >=
                            0 &&
                          diffDays <=
                            3
                        ) {
                          taskColor =
                            "#fee2e2";

                          urgent = true;
                        }

                        /* YELLOW */

                        else if (
                          diffDays >
                            3 &&
                          diffDays <=
                            5
                        ) {
                          taskColor =
                            "#fef3c7";
                        }

                        /* GREEN */

                        else {
                          taskColor =
                            "#dcfce7";
                        }
                      }

                      return (
                        <div
                          className="task"
                          key={
                            taskIndex
                          }
                          style={{
                            background:
                              taskColor,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              task.done
                            }
                            onChange={() =>
                              toggleTask(
                                projectIndex,
                                taskIndex
                              )
                            }
                          />

                          <div>
                            <input
                              className="input task-input task-name"
                              value={
                                task.name
                              }
                              onChange={(
                                e
                              ) =>
                                updateTask(
                                  projectIndex,
                                  taskIndex,
                                  "name",
                                  e.target
                                    .value
                                )
                              }
                            />

                            {urgent && (
                              <div className="urgent">
                                🔴
                                Urgent
                              </div>
                            )}
                          </div>

                          <input
                            className="input task-input"
                            type="date"
                            value={
                              task.date ||
                              ""
                            }
                            onChange={(
                              e
                            ) =>
                              updateTask(
                                projectIndex,
                                taskIndex,
                                "date",
                                e.target
                                  .value
                              )
                            }
                          />

                          <input
                            className="input task-input"
                            placeholder="Notes..."
                            value={
                              task.notes
                            }
                            onChange={(
                              e
                            ) =>
                              updateTask(
                                projectIndex,
                                taskIndex,
                                "notes",
                                e.target
                                  .value
                              )
                            }
                          />
                        </div>
                      );
                    }
                  )}

                  {/* BUTTONS */}

                  <div className="task-buttons">
                    <button
                      className="create-btn"
                      onClick={() =>
                        addTask(
                          projectIndex
                        )
                      }
                    >
                      + Add Task
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteLastTask(
                          projectIndex
                        )
                      }
                    >
                      Delete Last
                      Task
                    </button>

                    <button
                      className="complete-btn"
                      onClick={() =>
                        completeProject(
                          projectIndex
                        )
                      }
                    >
                      Complete
                      Project
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default App;