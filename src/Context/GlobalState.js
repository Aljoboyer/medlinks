import React from 'react'
import { createContext, useReducer, useEffect, useState } from 'react';
import reducers from "./Reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {QUERY_GETEXPERIENCELIST } from '../graphql';
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    user: {},
    cart: [],
    searchJob: [],
    flow: '',
    image: '',
  };
  const [state, dispatch] = useReducer(reducers, initialState);


  useEffect(() => {
    const userData = async () => {
      let user = await AsyncStorage.getItem("userToken");
      let flow = await AsyncStorage.getItem("FLOW");
      user = JSON.parse(user);
      if (user) {
        dispatch({
          type: "AUTH",
          payload:user,
        });
        dispatch({type:'FLOW', payload:flow})
      }
      
    };
    userData();
  }, []);



  return (
    <DataContext.Provider value={[state, dispatch]}>
      {children}
    </DataContext.Provider>
  );
};
