import { useState } from "react";
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
  Heading,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Switch,
  Stack,
  Text,
  Portal,
  FormLabel,
  EditableInput,
  EditablePreview,
  Editable,
  useDisclosure,
} from "@chakra-ui/react";

import "react-day-picker/dist/style.css";
import {
  getFormattedStringDate,
  getCorrectGMTDateObject,
} from "../../helpers/getFormattedDate";

const WorkLogItem = ({ data }) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    register,
    watch,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      description: data.description,
      date: getCorrectGMTDateObject(data.date),
      hours: data.hours,
      blb: data.blb,
    },
  });
  const [isEdited, setIsEdited] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCancel = () => {
    reset({
      description: data.description,
      date: getCorrectGMTDateObject(data.date),
      hours: data.hours,
      blb: data.blb,
    });
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

    console.log(updatedData);
    setIsEdited(false);
  };

  return (
    <Card
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      mb={4}
      boxShadow="md"
      bg="white"
    >
      <CardHeader p={0}>
        <Heading size="sm" my={2}>
          <Flex alignItems="center" position="relative">
            <Editable color="blue.600" defaultValue={data.description}>
              <EditablePreview minW={20} minH={6} cursor="pointer" />
              <EditableTextarea
                resize="vertical"
                h="100%"
                position="absolute"
                left={0}
                bg="white"
                zIndex={10}
                fontFamily="Open sans"
                fontSize={15}
                {...register("description")}
                onChange={() => setIsEdited(true)}
              />
            </Editable>
          </Flex>
        </Heading>
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

          <Flex alignItems="center" position="relative" w="50%">
            <Text m={0} mr={1}>
              <strong>Hours:</strong>
            </Text>
            <Editable defaultValue={data.hours}>
              <EditablePreview minW={20} minH={6} cursor="pointer" />
              <EditableInput
                type="number"
                position="absolute"
                h="20px"
                w="fit-content"
                left="53px"
                bg="white"
                step={0.25}
                min={0.25}
                max={8}
                fontSize="16px"
                {...register("hours")}
                onChange={() => setIsEdited(true)}
              />
            </Editable>
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
                  <FormLabel htmlFor="email-alerts" mb="0" w="100px" m={0}>
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
    </Card>
  );
};

export default WorkLogItem;
