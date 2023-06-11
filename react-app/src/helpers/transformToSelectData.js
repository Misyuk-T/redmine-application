export const getSelectValue = (projectId, projects) => {
  if (!projects || !projectId) {
    return {
      value: 0,
      label: "undefined",
    };
  }

  const project = projects.find((item) => item.id === projectId);

  return {
    value: project.id,
    label: `${project.projectName}  #${project.id} ${project.subject}`,
  };
};

export const transformToSelectData = (projects) => {
  return [...projects].map((item) => {
    return {
      value: item.id,
      label: `${item.projectName}  #${item.id} ${item.subject}`,
    };
  });
};
