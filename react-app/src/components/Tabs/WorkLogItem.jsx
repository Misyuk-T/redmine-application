import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

const WorkLogItem = ({ data }) => {
  const { blb, date, description, hours, project, task } = data;

  return (
    <Card
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      mb={4}
      boxShadow="md"
      bg="white"
    >
      <CardHeader p={0}>
        <Heading size="sm">{description}</Heading>
      </CardHeader>

      <CardBody as={Stack} gap={0} justifyContent="flex-end" p={0}>
        <Text m={2}>
          <strong>Date:</strong> {date}
        </Text>
        <Text m={2}>
          <strong>Hours:</strong> {hours}
        </Text>
        {project && (
          <Text m={2}>
            <strong>Project:</strong> {project}
          </Text>
        )}
        {task && (
          <Text m={2}>
            <strong>Task:</strong> {task}
          </Text>
        )}
        <Text>
          <strong>BLB:</strong> {blb}
        </Text>
      </CardBody>
    </Card>
  );
};

export default WorkLogItem;
