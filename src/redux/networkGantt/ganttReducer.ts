import {Task} from "../../types/public-types";

export interface taskState {
  taskModel: any;
}

export interface taskActionTypes {
  type: string;
  taskModel: Task;
}


export default (state:taskState = {taskModel:{}}, action: taskActionTypes) => {
  switch (action.type) {
    case 'enter':
      return {taskModel: action.taskModel}
  }
  return state
}
