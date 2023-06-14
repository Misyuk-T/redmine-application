import {
  AvatarBadge,
  Stack,
  Text,
  Avatar as ChakraAvatar,
  Flex,
} from "@chakra-ui/react";

const Avatar = ({ title, user }) => {
  const isJiraUser = title === "jira";
  const userName = isJiraUser
    ? user?.displayName
    : `${user?.firstname} ${user?.lastname}`;
  const userImage = isJiraUser ? user?.avatarUrls["48x48"] : user?.avatar_url;
  const connectedTitle = user ? "Connected to: " : "Disconnected: ";

  return (
    <Flex gap={1} boxShadow="sm" p={1} w="100%" alignItems="center" bg="white">
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
        <Text fontSize="xs" textAlign="center">
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Avatar;
