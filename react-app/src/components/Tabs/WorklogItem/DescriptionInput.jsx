import { Editable, EditablePreview, EditableTextarea } from "@chakra-ui/react";

const DescriptionInput = ({
  defaultValue,
  value,
  onChange,
  register,
  error,
}) => {
  return (
    <Editable
      color="blue.600"
      defaultValue={defaultValue}
      value={value}
      w="100%"
    >
      <EditablePreview
        fontWeight={600}
        w="100%"
        cursor="pointer"
        border="1px solid transparent"
        minH="58px"
        borderColor={error ? "tomato" : "transparent"}
      />
      <EditableTextarea
        h="52px"
        w="100%"
        fontWeight={600}
        fontFamily="Open sans"
        flexGrow={1}
        flexShrink={0}
        fontSize={15}
        register={register}
        onChange={onChange}
        minLength={1}
      />
    </Editable>
  );
};

export default DescriptionInput;
