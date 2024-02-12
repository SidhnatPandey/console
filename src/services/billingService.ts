import { setApiBaseUrl } from "src/@core/services/interceptor";
import { deleteCall, get, post, put } from "src/@core/services/masterServices";
import { APP_API } from "src/@core/static/api.constant";

export const saveCardSession = (
  sessionId: string,
  customerId: string,
  planId: string
) => {
  setApiBaseUrl("billing");
  let url = APP_API.saveCard;
  url = url.replace("{sessionId}", sessionId);
  url = url.replace("{customerId}", customerId);
  url = url.replace("{planId}", planId);
  return post(url, null).then((response) => response?.data);
};

export const getCards = () => {
  setApiBaseUrl("billing");
  return get(APP_API.getCards).then((response) => response?.data);
};

export const deleteCard = (cardId: string) => {
  setApiBaseUrl("billing");
  let url = APP_API.deleteCard;
  url = url.replace("{paymentMethod}", cardId);
  return deleteCall(url).then((response) => response?.data);
};

export const getPlans = () => {
  setApiBaseUrl("billing");
  return get(APP_API.getPlans).then((response) => response?.data);
};

export const makeCardDefault = (cardId: string, customerId: string) => {
  setApiBaseUrl("billing");
  let url = APP_API.makeCardDefault;
  url = url.replace("{paymentMethod}", cardId);
  url = url.replace("{customerId}", customerId);
  return put(url, null).then((response) => response?.data);
};

export const updateCard = (card: any) => {
  setApiBaseUrl("billing");
  let url = APP_API.updateCard;
  url = url.replace("{cardId}", card.id);
  return put(url, card).then((response) => response?.data);
};

export const listOfInvoice = () => {
  setApiBaseUrl("billing");
  return get(APP_API.listOfInvoices).then((response) => response?.data);
};
