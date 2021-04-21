import React from 'react';
import { Stack, IStackTokens, Text, FontSizes } from '@fluentui/react';
import logo from './logo.svg';
import './App.css';
import {GifSearch} from './Components/GifSearch';
import axios from 'axios';
import {NeutralColors} from '@fluentui/theme';

//const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const stackTokens: IStackTokens = { childrenGap: 15 };

// Artificial hourly-rate limiter (reload page to reset)
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
          maxWidth: '960px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#605e5c',
        },
      }}
      tokens={stackTokens}
    >
      <Stack
        styles={{
          root: {
            backgroundColor: NeutralColors.black,
            color: NeutralColors.white,
            width: '100%',
            height:'35px'
          }
        }}
        horizontal>
          <img src={logo} alt="logo" className="App-logo" />
          <Text styles={{root:{fontSize: FontSizes.large}}}>Giphy Example</Text>
      </Stack>
      <GifSearch />
    </Stack>
  );
};
