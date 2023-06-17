import { Controller } from "react-hook-form";
import {
  Flex,
  IconButton,
  Image,
  Link,
  ListItem,
  OrderedList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup as ChakraRadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";

import JiraAssistant0 from "../../assets/JiraAssistant0.png";
import JiraAssistant1 from "../../assets/JiraAssistant1.png";

const radioItem = [
  {
    name: "type",
    value: "jira",
    text: "Jira export",
    helper: (
      <OrderedList p={5}>
        <ListItem>
          <Text>Support export file from JiraAssistant chrome extension.</Text>
        </ListItem>
        <ListItem>
          <Text>
            Visit{" "}
            <Link
              target="blank"
              color="blue.500"
              href="https://jiraassistant.com/"
            >
              official site
            </Link>{" "}
            or{" "}
            <Link
              target="blank"
              color="blue.500"
              href="https://chrome.google.com/webstore/detail/jira-assistant-worklog-sp/momjbjbjpbcbnepbgkkiaofkgimihbii"
            >
              chrome market
            </Link>{" "}
            to install JiraAssistant.
          </Text>
        </ListItem>
        <ListItem>
          <Text>Link to the required jira account.</Text>
        </ListItem>
        <ListItem>
          <Text>Export worklogs as shown below.</Text>
        </ListItem>
        <ListItem pt={5}>
          <Image mx="auto" w={300} src={JiraAssistant0} />
        </ListItem>
        <ListItem pt={5}>
          <Image mx="auto" w={300} src={JiraAssistant1} />
        </ListItem>
      </OrderedList>
    ),
  },
  {
    name: "type",
    value: "custom",
    text: "Custom text",
    helper: (
      <OrderedList p={5}>
        <ListItem>
          <Text>Text file formatted as shown below</Text>
        </ListItem>
        <ListItem>
          <Text as="div">
            <Text fontWeight={600} mt={2}>
              12.06
            </Text>
            <pre />
            1. Daily meeting 0.5h blb
            <pre />
            2. AFS-616: Disable focus style when click on active. Adjust hover
            for disabled buttons 3h
            <pre />
            3. AFS-616: Resolve problem with close overlay click modal on dev
            env 1h
            <pre />
            <Text fontWeight={600} mt={2}>
              13.06
            </Text>
            <pre />
            1. Delete unnecessary import React from react 0.5h blb
            <pre />
            2. Replace slick carousel by react slick. Remove Slick carousel from
            project adjust slider spacing 2h blb
            <pre />
            3. AFS-617: Adjust next.config.js to enable pages file with .page
            ext. Change ext of all existing pages 1h blb
            <pre />
            4. AFS-617: Remove useTheme color in cases where it was possible
            0.5h
            <pre />
            5. AFS-617: Adjust fonts, accessibility and addons in storybook 4h
            <pre />
            <Text fontWeight={600} mt={2}>
              14.06
            </Text>
            <pre />
            1. Working on custom redmine loger Node js + react + electron 8h
            <pre />
          </Text>
        </ListItem>
      </OrderedList>
    ),
  },
];

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
            onChange(value);
            onToggle(false);
          }}
          ref={ref}
          value={value}
          gap={0}
        >
          {radioItem.map((item) => {
            return (
              <Flex alignItems="center" key={item.text}>
                <Radio name={item.name} value={item.value}>
                  {item.text}
                </Radio>

                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      opacity={0.5}
                      p={0}
                      h="15px"
                      w="10px"
                      background="transparent"
                      aria-label="helper popup"
                      icon={<QuestionIcon />}
                      transition="all .3s"
                      _hover={{
                        background: "transparent",
                        svg: {
                          opacity: "0.5",
                        },
                      }}
                    />
                  </PopoverTrigger>
                  <PopoverContent width="100%">
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight={600} fontSize={18}>
                      How to get:{" "}
                    </PopoverHeader>
                    <PopoverBody>{item.helper}</PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
            );
          })}
        </ChakraRadioGroup>
      )}
    />
  );
};

export default RadioGroup;
