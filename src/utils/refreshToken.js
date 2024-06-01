import {Amplify, Auth } from 'aws-amplify';
import aws_config_doctor from '../../aws-config.doctor';
Amplify.configure(aws_config_doctor);

export const refreshTokenHandler = async () => {
  try {
    console.log("callimg refesj toke  >>>>>>>>")
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const currentSession = await Auth.currentSession();
    console.log('currentSession >>>>>>', currentSession);
    // console.log('cognitoUser >>>>>>', cognitoUser);

    // const session = await cognitoUser.refreshToken(currentSession.refreshToken);
    return currentSession
  } catch (err) {
    console.log('err from refreshTokenHandler', err);
  }
};

