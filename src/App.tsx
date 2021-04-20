import React from 'react';
import { Stack, Text, Link, FontWeights, IStackTokens } from '@fluentui/react';
import logo from './logo.svg';
import './App.css';
import {GifSearch} from './Components/GifSearch';
import axios from 'axios';

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const stackTokens: IStackTokens = { childrenGap: 15 };

console.log(process.env.REACT_APP_GIPHY_API_KEY);

// Artificial hourly-rate limiter
let COUNTER = 0;
const HOUR_LIMIT=10;
axios.interceptors.response.use((res) => {
  // If at limit, overwrite response to fake an API error
  if(COUNTER >= HOUR_LIMIT){
    res.data = "API Usage Exceeded";
    res.status = 500;
    const error:any = new Error();
    error.response = res;
    throw error;
  }
  COUNTER++;
  return res;
}, (error) => Promise.reject(error))

export const App: React.FunctionComponent = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalFill
      styles={{
        root: {
          width: '960px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#605e5c',
        },
      }}
      tokens={stackTokens}
    >

      <GifSearch />
    </Stack>
  );
};
