import {applyMiddleware, compose, createStore} from "redux"
import { createWrapper} from "next-redux-wrapper"; 
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension"

import reducer from "./reducer";

const makeStore = () => {
  const logger = createLogger();
  const enhancer = compose(composeWithDevTools(applyMiddleware(logger)));
  const store = createStore(reducer, enhancer);
  return store;
};

export const wrapper = createWrapper(makeStore, {debug: true});