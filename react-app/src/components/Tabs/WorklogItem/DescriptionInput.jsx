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
      fontSize="13px"
    >
      <EditablePreview
        fontWeight={600}
        w="100%"
        fontFamily="Raleway"
        cursor="pointer"
        border="1px solid transparent"
        lineHeight={1.35}
        minH="45px"
        borderColor={error ? "tomato" : "transparent"}
      />
      <EditableTextarea
        h="45px"
        w="100%"
        fontWeight={600}
        fontFamily="Raleway"
        flexGrow={1}
        flexShrink={0}
        register={register}
        onChange={onChange}
        minLength={1.1}
        fontSize="13px"
        lineHeight={1.35}
      />
    </Editable>
  );
};

export default DescriptionInput;
