import { Controller } from "react-hook-form";
import Select from "react-select";

import useRedmineStore from "../../../store/redmineStore";
import { transformToSelectData } from "../../../helpers/transformToSelectData";

const ProjectsSelect = ({ onChange, control, value }) => {
  const { projects } = useRedmineStore();
  const formattedProjectData = transformToSelectData(projects);

  return (
    <Controller
      name="project"
      control={control}
      render={({ field }) => {
        return (
          <Select
            {...field}
            value={value}
            onChange={onChange}
            options={formattedProjectData}
            placeholder="Select project ..."
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                cursor: "pointer",
                borderColor: state.isFocused
                  ? "grey"
                  : "transparent !important",
              }),
              indicatorsContainer: (baseStyles) => ({
                ...baseStyles,
                display: "none",
              }),
              container: (baseStyles) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
          />
        );
      }}
    />
  );
};

export default ProjectsSelect;
