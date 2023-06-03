import { useForm, Controller } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import FileUpload from "./FileUpload";
import { AddIcon } from "@chakra-ui/icons";

const Form = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(data => console.log("On Submit: ", data));

  const validateFiles = value => {
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
    <form onSubmit={onSubmit}>
      <FormControl isInvalid={!!errors.file} isRequired>
        <FormLabel>{"File input"}</FormLabel>
        <FileUpload
          accept={"text"}
          register={register("file", { validate: validateFiles })}
        >
          <Button leftIcon={<Icon as={AddIcon} />}>Upload</Button>
        </FileUpload>

        <FormErrorMessage>
          {errors.file && errors?.file.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.type} isRequired>
        <FormLabel>Choose type of export file: </FormLabel>

        <Controller
          control={control}
          name="test"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <RadioGroup
              name="type"
              spacing={4}
              defaultValue="custom"
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
              value={value}
            >
              <Radio
                name="type"
                value="jira"
                border="1px solid"
                borderColor="gray.400"
              >
                Jira export
              </Radio>
              <Radio
                name="type"
                value="custom"
                border="1px solid"
                borderColor="gray.400"
              >
                Custom txt
              </Radio>
            </RadioGroup>
          )}
        />

        <FormErrorMessage>
          {errors.type && errors?.type.message}
        </FormErrorMessage>
      </FormControl>

      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
};

export default Form;
