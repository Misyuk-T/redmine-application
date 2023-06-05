import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import useWorkLogsStore from "../../store/store";

import FileUpload from "./FileUpload";
import RadioGroup from "./RadioGroup";

import { sendWorkLogs } from "../../actions/workLogs";

const Form = () => {
  const {
    workLogs,
    error,
    addWorkLogs,
    resetWorkLogs,
    addWorkLog,
    editWorkLog,
    addWorkLogsError,
    resetWorkLogsError,
  } = useWorkLogsStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    resetField,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("type", data.type);

    await sendWorkLogs(formData)
      .then((data) => {
        data && addWorkLogs(data);
        console.log("inside set data");
      })
      .catch((error) => {
        console.error("err2", error);
        addWorkLogsError(error);
      });
  });

  const validateFiles = (value) => {
    if (value.length < 1) {
      return "Files is required";
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return "Max file size 10mb";
      }
    }
    return true;
  };

  return (
    <Card
      as="form"
      onSubmit={onSubmit}
      method="post"
      encType="multipart/form-data"
      width="fit-content"
      bg="green.50"
      m="0 0 0 auto"
    >
      <CardBody as={Stack}>
        <Heading size="md">Worklogs form</Heading>

        <Flex gap={50} alignItems="end" flexWrap="wrap">
          <Flex gap={50}>
            <FormControl
              as={Flex}
              flexDirection="column"
              justifyContent="space-between"
              isInvalid={!!errors.file}
              isRequired
            >
              <Text as={FormLabel} fontSize="md">
                Choose a file:
              </Text>
              <FileUpload
                accept={"text"}
                onReset={() => resetField("file")}
                register={register("file", { validate: validateFiles })}
              />
              <Text as={FormErrorMessage} fontSize="md" color="tomato">
                {errors.file && errors?.file.message}
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.type}>
              <Text as={FormLabel} fontSize="md">
                Choose file type:
              </Text>
              <RadioGroup control={control} />

              <Text as={FormErrorMessage} fontSize="md" color="tomato">
                {errors.type && errors?.type.message}
              </Text>
            </FormControl>
          </Flex>

          <Button
            flexShrink={0}
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Form;
