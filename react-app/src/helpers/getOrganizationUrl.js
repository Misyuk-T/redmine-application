export const getOrganizationUrls = (jiraOrganization, redmineOrganization) => {
  const redmineUrl = redmineOrganization
    ? `https://redmine.${redmineOrganization}.com`
    : "";
  const jiraUrl = jiraOrganization
    ? `https://${jiraOrganization}.atlassian.net`
    : "";

  return { redmineUrl, jiraUrl };
};
