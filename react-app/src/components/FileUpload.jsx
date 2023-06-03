import { useRef } from "react";
import { Box, InputGroup } from "@chakra-ui/react";

const FileUpload = ({ register, accept, multiple, children }) => {
  const inputRef = useRef(null);

  const { ref, ...rest } = register;

  const handleClick = () => inputRef.current?.click();

  return (
    <InputGroup onClick={handleClick}>
      <Box
        as={"input"}
        type={"file"}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={e => {
          ref(e);
          inputRef.current = e;
        }}
      />
      <>{children}</>
    </InputGroup>
  );
};

export default FileUpload;
