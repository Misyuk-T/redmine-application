import {
  Box,
  Flex,
  FormLabel,
  IconButton,
  Input,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  InputLeftAddon,
  InputRightAddon,
  InputGroup,
  Text,
} from "@chakra-ui/react";

import { InfoIcon } from "@chakra-ui/icons";

const SettingModalFieldItem = ({
  register,
  name,
  id,
  children,
  leftAddon,
  rightAddon,
  errors,
}) => {
  return (
    <Box width="100%">
      <Flex alignItems="center">
        <FormLabel m={0} htmlFor={id}>
          {name}
        </FormLabel>

        {children && (
          <Popover>
            <PopoverTrigger>
              <IconButton
                p={0}
                h="15px"
                w="10px"
                background="transparent"
                aria-label="helper popup"
                icon={<InfoIcon />}
                transition="all .3s"
                _hover={{
                  background: "transparent",
                  svg: {
                    opacity: "0.5",
                  },
                }}
              />
            </PopoverTrigger>
            <PopoverContent width="100%" p={5}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader fontWeight={600} fontSize={18}>
                How to get:{" "}
              </PopoverHeader>
              <PopoverBody>{children}</PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Flex>

      <InputGroup size="sm">
        {leftAddon && <InputLeftAddon children={leftAddon} />}
        <Input
          type="text"
          id={id}
          {...register(id, { required: true })}
          isInvalid={errors[id]}
        />
        {rightAddon && <InputRightAddon children={rightAddon} />}
      </InputGroup>

      {errors[id] && (
        <Text fontSize="sm" color="tomato">
          This field is required.
        </Text>
      )}
    </Box>
  );
};

export default SettingModalFieldItem;
