import Cookies from 'js-cookie';
import HttpRequest from "./axios";


const TOKEN_KEY = "bimcctoken"
const baseUrl = ""

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token != undefined && token != '') {
    return token;
  }
  return '';
};

export const axios = new HttpRequest(baseUrl)
