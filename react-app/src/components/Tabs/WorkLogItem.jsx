import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  EditableTextarea,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Switch,
  Stack,
  Text,
  Portal,
  FormLabel,
  EditablePreview,
  Editable,
  useDisclosure,
  IconButton,
  Icon,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import useWorkLogsStore from "../../store/store";
import {
  getFormattedStringDate,
  getCorrectGMTDateObject,
} from "../../helpers/getFormattedDate";

const handleTextValidate = (value) => {
  if (value.length < 1) {
    return "Description  can`t be empty";
  }

  return true;
};

const handleNumbersValidate = (value) => {
  if (isNaN(value) || value > 8 || value <= 0) {
    return "Uncorrected hours field";
  }

  return true;
};

const WorkLogItem = ({ data }) => {
  const defaultValues = {
    description: data.description,
    date: getCorrectGMTDateObject(data.date),
    hours: data.hours,
    blb: data.blb,
  };

  const { workLogs, updateWorkLog, deleteWorkLog } = useWorkLogsStore();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
  });
  const [isEdited, setIsEdited] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const originDate = useRef(data.date);

  const handleCancel = () => {
    reset(defaultValues);
    setIsEdited(false);
  };

  const handleSave = (formData) => {
    const { description, date, hours, blb } = formData;

    const updatedData = {
      ...data,
      description: description || data.description,
      date: getFormattedStringDate(date),
      hours: hours || data.hours,
      blb: blb || data.blb,
    };

    updateWorkLog(originDate.current, data.id, updatedData);
    setIsEdited(false);
  };

  const handleDelete = () => {
    deleteWorkLog(originDate.current, data.id);
  };

  return (
    <Card
      borderWidth="1px"
      borderRadius="lg"
      position="relative"
      p={4}
      mb={4}
      boxShadow="md"
      bg="white"
      pr={6}
      border="2px solid transparent"
      borderColor={Object.entries(errors).length && "tomato"}
    >
      <CardHeader position="relative" p={0}>
        {isEdited && (
          <IconButton
            colorScheme="red"
            position="absolute"
            size="xs"
            aria-label="delete"
            right={-5}
            top={-3}
            onClick={handleDelete}
            icon={<Icon as={DeleteIcon} />}
          />
        )}

        <Flex alignItems="flex-start" position="relative" minH="60px" mr={2}>
          <Editable
            color="blue.600"
            defaultValue={data.description}
            value={watch("description")}
            w="100%"
          >
            <EditablePreview fontWeight={600} w="100%" cursor="pointer" />
            <EditableTextarea
              w="100%"
              fontWeight={600}
              fontFamily="Open sans"
              flexGrow={1}
              flexShrink={0}
              fontSize={15}
              register={register("description", {
                validate: handleTextValidate,
              })}
              onChange={(value) => {
                setValue("description", value.target.value);
                setIsEdited(true);
              }}
            />
          </Editable>
        </Flex>
      </CardHeader>

      <CardBody as={Stack} gap={0} justifyContent="flex-end" p={0}>
        <Flex alignItems="center">
          <Popover
            placement="bottom-start"
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          >
            <PopoverTrigger>
              <Text m={0} w="50%" cursor="pointer">
                <strong>Date: </strong>
                {getFormattedStringDate(watch("date")) || data.date}
              </Text>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverBody>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => {
                      return (
                        <DayPicker
                          {...field}
                          ref={null}
                          placeholderText="Select date"
                          selected={field.value}
                          showOutsideDays
                          mode="single"
                          defaultMonth={field.value}
                          onDayClick={(date) => {
                            setValue("date", date);
                            onClose();
                            setIsEdited(true);
                          }}
                        />
                      );
                    }}
                  />
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>

          <Flex w="50%" alignItems="center">
            <Text m={0} mr={1}>
              <strong>Hours:</strong>
            </Text>
            <NumberInput
              defaultValue={data.hours}
              value={watch("hours")}
              w="80px"
              min={0.25}
              max={8}
              step={0.25}
              keepWithinRange
              allowMouseWheel
              fontSize="16px"
              onChange={(value) => {
                setValue("hours", +value);
                setIsEdited(true);
              }}
            >
              <NumberInputField
                register={register("hours", {
                  validate: handleNumbersValidate,
                })}
                cursor="pointer"
                border="none"
                pl="5px"
                _focus={{
                  opacity: "1",
                  "& ~ div": {
                    opacity: 1,
                  },
                }}
              />

              <NumberInputStepper opacity="0" transition="opacity 0.2s">
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
        </Flex>

        {data.project ||
          (data.task && (
            <Flex alignItems="center" position="relative" mt={2}>
              <Text m={0} w="50%">
                <strong>Project:</strong> {data.project}
              </Text>

              <Text m={0} w="50%">
                <strong>Task:</strong> {data.task}
              </Text>
            </Flex>
          ))}

        <Flex alignItems="center" justifyContent="space-between" mt={3} h={8}>
          <Controller
            name="blb"
            control={control}
            render={({ field }) => {
              const isChecked = field.value === "blb";
              return (
                <Flex alignItems="center">
                  <FormLabel
                    htmlFor="email-alerts"
                    mb="0"
                    w="100px"
                    m={0}
                    fontWeight={400}
                  >
                    <Text as="strong" display="inline-block" mr="2px">
                      Status:
                    </Text>{" "}
                    {watch("blb") || data.blb}
                  </FormLabel>

                  <Switch
                    {...field}
                    isChecked={isChecked}
                    onChange={(e) => {
                      const isChecked = e.target.checked ? "blb" : "nblb";
                      field.onChange(isChecked);
                      setIsEdited(true);
                    }}
                  />
                </Flex>
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
