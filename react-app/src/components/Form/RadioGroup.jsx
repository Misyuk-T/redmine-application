import { Controller } from "react-hook-form";
import { Radio, RadioGroup as ChakraRadioGroup, Stack } from "@chakra-ui/react";

const RadioGroup = ({ control }) => {
  return (
    <Controller
      control={control}
      name="type"
      defaultValue="custom"
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <ChakraRadioGroup
          as={Stack}
          width="max-content"
          name="type"
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
        </ChakraRadioGroup>
      )}
    />
  );
};

export default RadioGroup;
