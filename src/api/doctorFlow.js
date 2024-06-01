import {
  REACT_APP_DOCTORS_FLOW_GRAPHQL_MAIN_URL,
  REACT_APP_DOCTORS_FLOW_AUTHORITYL,
  REACT_APP_DOCTORS_FLOW_REFERER,


  REACT_APP_FAQ_FLOW_GRAPHQL_MAIN_URL,
  REACT_APP_FAQ_FLOW_AUTHORITYL,
  REACT_APP_FAQ_FLOW_X_API_KEY,
  REACT_APP_FAQ_FLOW_USER_AGENT
} from "@env"
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Amplify, Auth, Hub } from 'aws-amplify'
import aws_config_doctor from '../../aws-config.doctor';
Amplify.configure(aws_config_doctor);

export const refreshJwtToken = async () => {
  // console.log("entered entered")
  const refresh_token = await AsyncStorage.getItem("refreshToken");
  // let refresh_token = res["refreshToken"]["token"];
  // console.log("rfresh token", refresh_token)

  try {
    const res = await Auth.currentSession()
    let access_token = res["accessToken"]["jwtToken"];
    let idToken = res["idToken"]["jwtToken"];
    await AsyncStorage.setItem("accessToken", access_token);
    await AsyncStorage.setItem("idToken", idToken);
    // AsyncStorage.setItem("refreshToken", refresh_token);
    return access_token;
  }
  catch (err) {
    console.log('error from doctor flow ==>', err)

    // window.location.href = "/jobseeker-login";
  }
  // }
}

export const gqlquery = async (query, variables) => {
  // const access_token = token?.jwtToken ? token?.jwtToken : token
  const access_token = await AsyncStorage.getItem("accessToken");
  // console.log('access_token Token ==>>', access_token)
  const gquery = {
    query: query.query,
    variables: variables,
  }
  // let decoded = access_token ? jwt_decode(access_token) : '';

  let final_token = access_token ? await refreshJwtToken() : '';

  // if (access_token) {
  //   if (decoded.exp < (new Date().getTime() + 1) / 1000) {
  //     console.log("token expired");
  //     final_token = await refreshJwtToken();
  //   }
  //   else {
  //     console.log("token not expired");
  //     final_token = access_token;
  //   }
  // }
  // console.log('final_token Token ==toke>>', final_token)
  return fetch(`${REACT_APP_DOCTORS_FLOW_GRAPHQL_MAIN_URL}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authority: `${REACT_APP_DOCTORS_FLOW_AUTHORITYL}`,
      authorization: final_token,
      referer: `${REACT_APP_DOCTORS_FLOW_REFERER}`,
      'accept-language': 'en-US,en;q=0.9',
    },
    body: JSON.stringify(gquery),
  })
}

export const gqlOpenQuery = (query, variables) => {
  // console.log(query, variables)
  const gquery = {
    query: query.query,
    variables: variables,
  }
  return fetch(
    `${REACT_APP_FAQ_FLOW_GRAPHQL_MAIN_URL}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authority: `${REACT_APP_FAQ_FLOW_AUTHORITYL}`,
        referer: 'https://ap-south-1.console.aws.amazon.com/',
        "accept-language": "en-US,en;q=0.9",
        "x-api-key": `${REACT_APP_FAQ_FLOW_X_API_KEY}`,
        "X-Amz-User-Agent": `${REACT_APP_FAQ_FLOW_USER_AGENT}`,
      },
      body: JSON.stringify(gquery),
    }
  )
} 