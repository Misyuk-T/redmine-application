import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Stack,
  Text,
  IconButton,
  Icon,
  Box,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import useJiraStore from "../../../store/jiraStore";
import useWorkLogsStore from "../../../store/worklogsStore";
import {
  getFormattedStringDate,
  getCorrectGMTDateObject,
} from "../../../helpers/getFormattedDate";
import { getIssueValue } from "../../../helpers/transformToSelectData";

import DescriptionInput from "./DescriptionInput";
import DatePicker from "./DatePicker";
import HoursInput from "./HoursInput";
import StatusSwitch from "./StatusSwitch";
import ProjectsSelect from "./ProjectsSelect";
import IssuesSelect from "./IssuesSelect";

const handleNumbersValidate = (value) => {
  if (isNaN(value) || value > 8 || value <= 0) {
    return "Uncorrected hours field";
  }

  return true;
};

const handleTextValidate = (value) => {
  if (value.length < 1) {
    return "Description  can`t be empty";
  }

  return true;
};

const WorkLogItem = ({ data }) => {
  const { assignedIssues } = useJiraStore();
  const { updateWorkLog, deleteWorkLog } = useWorkLogsStore();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      description: data.description,
      date: getCorrectGMTDateObject(data.date),
      project: data.project,
      hours: data.hours,
      blb: data.blb,
      task: getIssueValue(data.task, assignedIssues),
    },
  });
  const [isEdited, setIsEdited] = useState(false);
  const originDate = useRef(data.date);

  const isNewTask = data.description === "New task";
  const isNotValidCard = Object.entries(errors).length;
  const borderCardColor = isNotValidCard
    ? "tomato"
    : isNewTask
    ? "blue.600"
    : "transparent";

  const handleCancel = () => {
    reset({
      description: data.description,
      date: getCorrectGMTDateObject(data.date),
      project: data.project,
      hours: data.hours,
      blb: data.blb,
      task: getIssueValue(data.task, assignedIssues),
    });
    setIsEdited(false);
  };

  const handleSave = (formData) => {
    const { description, date, hours, blb, project, task } = formData;

    const updatedData = {
      ...data,
      description: description || data.description,
      date: getFormattedStringDate(date),
      hours: +hours || +data.hours,
      blb: blb || data.blb,
      project: project?.value || data.project,
      task: task?.value || "",
    };

    updateWorkLog(originDate.current, data.id, updatedData);
    setIsEdited(false);
  };

  const handleDelete = () => {
    deleteWorkLog(originDate.current, data.id);
  };

  useEffect(() => {
    setValue("blb", data.blb);
  }, [data.blb]);

  return (
    <Card
      borderWidth="2px"
      borderRadius="lg"
      position="relative"
      p={4}
      mb={4}
      boxShadow="md"
      bg="white"
      pr={6}
      border="2px solid transparent"
      borderColor={borderCardColor}
    >
      <CardHeader position="relative" p={0}>
        <IconButton
          colorScheme="red"
          position="absolute"
          size="xs"
          aria-label="delete"
          right={-5}
          top={-3}
          opacity={0.3}
          onClick={handleDelete}
          icon={<Icon as={DeleteIcon} />}
          _hover={{
            opacity: 1,
          }}
        />

        <Flex alignItems="flex-start" position="relative" minH="50px" mr={2}>
          <DescriptionInput
            register={register("description", {
              validate: handleTextValidate,
            })}
            defaultValue={data.description}
            value={watch("description")}
            onChange={(value) => {
              setValue("description", value.target.value);
              setIsEdited(true);
            }}
            error={errors?.description}
          />
        </Flex>
      </CardHeader>

      <CardBody as={Stack} gap={0} justifyContent="flex-end" p={0}>
        <Flex alignItems="center" mb="6px">
          <DatePicker
            defaultValue={data.date}
            value={watch("date")}
            control={control}
            onChange={(date) => {
              setValue("date", date);
              setIsEdited(true);
            }}
          />

          <Flex w="50%" alignItems="center">
            <Text m={0} mr={1}>
              <strong>Hours:</strong>
            </Text>
            <HoursInput
              register={register("hours", {
                validate: handleNumbersValidate,
              })}
              defaultValue={data.hours}
              value={watch("hours")}
              onChange={(value) => {
                setValue("hours", value);
                setIsEdited(true);
              }}
            />
          </Flex>
        </Flex>

        <Stack gap={0}>
          <Flex alignItems="center" w="100%">
            <Text m={0}>
              <strong>Project:</strong>{" "}
            </Text>
            <Box width="300px">
              <ProjectsSelect
                value={watch("project") || data.project}
                control={control}
                onChange={(project) => {
                  setValue("project", project);
                  setIsEdited(true);
                }}
              />
            </Box>
          </Flex>

          <Flex alignItems="center" w="100%">
            <Text m={0}>
              <strong>Task:</strong>{" "}
            </Text>
            <Box width="300px">
              <IssuesSelect
                value={
                  watch("task") || getIssueValue(data.task, assignedIssues)
                }
                control={control}
                onChange={(task) => {
                  setValue("task", task);
                  setIsEdited(true);
                }}
              />
            </Box>
          </Flex>
        </Stack>

        <Flex alignItems="center" justifyContent="space-between" h={8}>
          <Controller
            name="blb"
            control={control}
            // defaultValue={data.blb}
            render={({ field }) => {
              return (
                <StatusSwitch
                  value={watch("blb")}
                  onChange={(value) => {
                    field.onChange(value);
                    setIsEdited(true);
                  }}
                />
              );
            }}
          />

          {isEdited && (
            <ButtonGroup justifyContent="center" size="sm">
              <Button
                disabled={!isValid}
                colorScheme="teal"
                type="submit"
                onClick={handleSubmit(handleSave)}
                mr={2}
              >
                Save
              </Button>
              <Button color="tomato" onClick={handleCancel}>
                Cancel
              </Button>
            </ButtonGroup>
          )}
        </Flex>
      </CardBody>

      <Text
        fontSize="sm"
        m={0}
        fontWeight={400}
        color="tomato"
        position="absolute"
        top="100%"
      >
        {errors?.description && errors?.description.message}
        <br />
        {errors?.hours && errors?.hours.message}
      </Text>
    </Card>
  );
};

export default WorkLogItem;
