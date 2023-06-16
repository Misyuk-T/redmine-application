import { Controller } from "react-hook-form";
import { Radio, RadioGroup as ChakraRadioGroup, Stack } from "@chakra-ui/react";

const RadioGroup = ({ control, onToggle }) => {
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
          onChange={(value) => {
              onChange(value)
              onToggle(false)
          }}
          ref={ref}
          value={value}
          gap={0}
        >
          <Radio name="type" value="jira">
            Jira export
          </Radio>
          <Radio name="type" value="custom">
            Custom txt
          </Radio>
        </ChakraRadioGroup>
      )}
    />
  );
};

export default RadioGroup;
