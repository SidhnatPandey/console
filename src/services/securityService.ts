import { APP_API } from "src/@core/static/api.constant";
import { get, post } from "../@core/services/masterServices";
import { setApiBaseUrl } from "src/@core/services/interceptor";

export const vulnerabilitiesList = (workspace_id: string, run_type: string) => {
  setApiBaseUrl("security");
  let url = APP_API.vulernabilities.replace("{workspace_id}", workspace_id);
  url = url.replace("{run_type}", run_type);
  return get(url).then((response) => response?.data);
};

export const getScans = (
  workspace_id: string,
  run_type: string,
  app_id?: string
) => {
  setApiBaseUrl("security");
  let url = APP_API.getScans.replace("{workspace_id}", workspace_id);
  url = url.replace("{run_type}", run_type);
  if (app_id) {
    url = url + "&app_id=" + app_id;
  }
  return get(url).then((response) => response?.data);
};

export const getAllvulnerabilities = (
  workspace_id: string,
  run_type: string,
  app_id?: string
) => {
  setApiBaseUrl("security");
  let url = APP_API.allVulnerabilities.replace("{workspace_id}", workspace_id);
  url = url.replace("{run_type}", run_type);
  if (app_id) {
    url = url + "&app_id=" + app_id;
  }
  return get(url).then((response) => response?.data);
};

export const cveVulnerabilitiesList = (
  app_id: string,
  run_type: string,
  workspace_id: string
) => {
  setApiBaseUrl("security");
  let url = APP_API.cveVulernabilities.replace("{app_id}", app_id);
  url = url.replace("{run_type}", run_type);
  url = url.replace("{workspace_id}", workspace_id);
  return get(url).then((response) => response?.data);
};

export const cveHistory = (
  app_id: string,
  run_type: string,
  workspace_id: string
) => {
  setApiBaseUrl("security");
  let url = APP_API.cveHistoryChart.replace("{app_id}", app_id);
  url = url.replace("{run_type}", run_type);
  url = url.replace("{workspace_id}", workspace_id);
  return get(url).then((response) => response?.data);
};

export const appAffected = (
  cve_id: string,
  run_type: string,
  workspace_id: string
) => {
  setApiBaseUrl("security");
  let url = APP_API.appsAffectedByCve.replace("{cve_id}", cve_id);
  url = url.replace("{run_type}", run_type);
  url = url.replace("{workspace_id}", workspace_id);
  return get(url).then((response) => response?.data);
};

export const getEpssScore = (cve_id: string) => {
  setApiBaseUrl("security");
  const url = APP_API.epssScore.replace("{cve_id}", cve_id);
  return get(url).then((response) => response?.data);
};

export const sbom = (
  app_id: string,
  run_type: string,
  workspace_id: string
) => {
  setApiBaseUrl("security");
  let url = APP_API.sbom.replace("{app_id}", app_id);
  url = url.replace("{run_type}", run_type);
  url = url.replace("{workspace_id}", workspace_id);
  return get(url).then((response) => response?.data);
};

export const downloadAppVulCve = (
  app_id: string,
  run_type: string,
  workspace_id: string
) => {
  setApiBaseUrl("security");
  let url = APP_API.downloadAppVulCve.replace("{app_id}", app_id);
  url = url.replace("{run_type}", run_type);
  url = url.replace("{workspace_id}", workspace_id);
  return get(url).then((response) => response?.data);
};

export const overallExpo = (
  workspace_id: string,
  run_type: string,
  app_id: string
) => {
  setApiBaseUrl("security");
  let url = APP_API.overallExpo.replace("{workspace_id}", workspace_id);
  url = url.replace("{run_type}", run_type);
  url = url.replace("{app_id}", app_id);
  return get(url).then((response) => response?.data);
};
