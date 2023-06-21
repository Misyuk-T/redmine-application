import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, StarIcon, UnlockIcon } from "@chakra-ui/icons";

import useRedmineStore from "../../store/redmineStore";
import useJiraStore from "../../store/jiraStore";
import useSettingsStore from "../../store/settingsStore";

import { getCurrentSettings, getSettings } from "../../actions/settings";
import { getOrganizationUrls } from "../../helpers/getOrganizationUrl";

import SettingModalItem from "./SettingModalItem";

const defaultSetting = {
  presetName: "unnamed",
  redmineUrl: "default",
  jiraUrl: "default",
  redmineApiKey: "default",
  jiraApiKey: "default",
  jiraEmail: "default",
};

const SettingModal = () => {
  const {
    settings,
    updateSettings,
    addSettings,
    addCurrentSettings,
    currentSettings,
  } = useSettingsStore();
  const { addOrganizationURL: setJiraUrl } = useJiraStore();
  const { addOrganizationURL } = useRedmineStore();

  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const settingsArray = settings ? Object.entries(settings) : [];
  const isLastItem = settingsArray.length === 1;

  const handleAddNew = () => {
    updateSettings(defaultSetting);
  };

  const saveOrganizationUrls = (jiraOrganization, redmineOrganization) => {
    const { redmineUrl, jiraUrl } = getOrganizationUrls(
      jiraOrganization,
      redmineOrganization
    );

    addOrganizationURL(redmineUrl);
    setJiraUrl(jiraUrl);
  };

  const fetchSettings = async () => {
    await getSettings().then((data) => {
      addSettings(data);
    });

    await getCurrentSettings().then((data) => {
      addCurrentSettings(data);
      saveOrganizationUrls(data.jiraUrl, data.redmineUrl);
    });
  };

  const handleSetFirst = () => {
    setActiveTab(0);
  };

  useEffect(() => {
    fetchSettings().then();

    if (settingsArray.length === 0) {
      handleAddNew();
    }
  }, []);

  return (
    <>
      <Button
        display="flex"
        flexDirection="column"
        onClick={onOpen}
        fontSize="xs"
        p={2}
        gap={1}
        colorScheme="orange"
        boxShadow="xl"
      >
        <UnlockIcon />
        <Text>Settings</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="fit-content">
          <ModalHeader
            w="100%"
            p="20px 30px"
            borderBottom="1px solid"
            borderColor="gray.300"
          >
            Settings:
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Tabs
              isFitted
              index={activeTab}
              isManual
              onChange={(index) => {
                setActiveTab(index);
              }}
            >
              <TabList>
                {settingsArray.map((item) => {
                  const isCurrent = currentSettings?.id === item[1]?.id;
                  return (
                    <Tab key={item[1].presetName}>
                      <Text whiteSpace="nowrap" fontWeight={600}>
                        {item[1].presetName}
                      </Text>
                      {isCurrent && <StarIcon color="orange" ml={2} />}
                    </Tab>
                  );
                })}
                <Button
                  onClick={handleAddNew}
                  fontSize="xs"
                  borderRadius={0}
                  variant="ghost"
                >
                  <AddIcon />
                </Button>
              </TabList>

              <TabPanels>
                {settingsArray.map((item) => {
                  return (
                    <SettingModalItem
                      data={item[1]}
                      isLastItem={isLastItem}
                      onDelete={handleSetFirst}
                      key={item[1].id}
                    />
                  );
                })}
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingModal;
