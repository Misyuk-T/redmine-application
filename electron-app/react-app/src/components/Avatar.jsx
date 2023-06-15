import {
  AvatarBadge,
  Stack,
  Text,
  Avatar as ChakraAvatar,
  Flex,
  LinkOverlay,
  LinkBox,
} from "@chakra-ui/react";

import useRedmineStore from "../store/redmineStore";
import useJiraStore from "../store/jiraStore";

const Avatar = ({ title, user }) => {
  const { organizationURL } = useRedmineStore();
  const { organizationURL: jiraUrl } = useJiraStore();

  const isJiraUser = title === "jira";
  const userName = isJiraUser
    ? user?.displayName
    : `${user?.firstname} ${user?.lastname}`;
  const userImage = isJiraUser ? user?.avatarUrls["48x48"] : user?.avatar_url;
  const connectedTitle = user ? "Connected to: " : "Disconnected: ";
  const avatarUrl = isJiraUser ? jiraUrl : organizationURL;

  return (
    <Flex
      as={LinkBox}
      gap={1}
      boxShadow="sm"
      p={1}
      w="100%"
      alignItems="center"
      bg="white"
      borderRadius={5}
    >
      <ChakraAvatar size="sm" name={userName} src={userImage}>
        <AvatarBadge
          borderColor="papayawhip"
          boxSize="1em"
          bg={user ? "green.500" : "tomato"}
        />
      </ChakraAvatar>

      <Stack alignItems="center" gap={0} w="100%">
        <Text fontSize="xs" fontWeight={700} textAlign="center">
          {connectedTitle}
        </Text>

        <LinkOverlay
          fontSize="xs"
          textAlign="center"
          href={avatarUrl}
          target="_blank"
          _hover={{
            textDecoration: "underline",
          }}
        >
          {title}
        </LinkOverlay>
      </Stack>
    </Flex>
  );
};

export default Avatar;
