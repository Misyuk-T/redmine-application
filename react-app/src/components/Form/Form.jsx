import { useState } from "react";
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

import useWorkLogsStore from "../../store/worklogsStore";

import FileUpload from "./FileUpload";
import RadioGroup from "./RadioGroup";

import { sendWorkLogs } from "../../actions/workLogs";

const Form = () => {
  const { addWorkLogs, addWorkLogsError, resetWorkLogs } = useWorkLogsStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    resetField,
  } = useForm();

  const [isSent, setIsSent] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("type", data.type);

    await sendWorkLogs(formData)
      .then((data) => {
        data && addWorkLogs(data);
        setIsSent(true);
      })
      .catch((error) => {
        console.error("Error: ", error);
        addWorkLogsError(error);
      });
  });

  const validateFiles = (value) => {
    if (!value || value.length < 1) {
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
      position="relative"
      onSubmit={onSubmit}
      method="post"
      boxShadow="md"
      encType="multipart/form-data"
      width="fit-content"
      bg="green.50"
      w="50%"
      alignSelf="baseline"
    >
      <CardBody as={Stack} p={4}>
        <Heading size="md" mb={2}>
          Worklogs form
        </Heading>

        <Flex alignItems="end" flexWrap="wrap" gap={5}>
          <Flex gap={50}>
            <FormControl
              as={Flex}
              flexDirection="column"
              justifyContent="space-between"
              isInvalid={!!errors.file}
              isRequired
            >
              <Text
                position="absolute"
                as={FormErrorMessage}
                fontSize="sm"
                color="tomato"
                top="12px"
              >
                {errors.file && errors?.file.message}
              </Text>
              <Text as={FormLabel} fontSize="md">
                Choose a file:
              </Text>
              <FileUpload
                accept={"text"}
                onReset={() => {
                  resetField("file");
                  setIsSent(false);
                  resetWorkLogs();
                }}
                register={register("file", { validate: validateFiles })}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.type}>
              <Text as={FormLabel} fontSize="md">
                Choose file type:
              </Text>
              <RadioGroup control={control} />

              <Text as={FormErrorMessage} fontSize="md" color="tomato">
                {errors?.type && errors.type.message}
              </Text>
            </FormControl>
          </Flex>

          <Button
            m="0 0 0 auto"
            flexShrink={0}
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            isDisabled={isSent || !isValid}
          >
            Submit
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Form;
