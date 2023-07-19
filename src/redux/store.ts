import { createStore, combineReducers } from 'redux';
import ganttReducer from "./networkGantt/ganttReducer";

const rootReducer = combineReducers({
  networkGantt: ganttReducer
})
const store = createStore(rootReducer);
export default store;
