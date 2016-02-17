import { randomizeData } from './core';

export default (state = randomizeData(), action) => {
  switch(action.type) {
    case 'RANDOMIZE':
      return randomizeData();
  }
  return state;
}
