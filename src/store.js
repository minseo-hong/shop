import { combineReducers, createStore } from 'redux';

let defaultStateOfCart = [
  { id: 0, name: 'White and Black', quan: 2 },
  { id: 1, name: 'Red Knit', quan: 1  }
];

const reducerOfCart = (state=defaultStateOfCart, action) => {
  let newState = []
  let index = 0

  switch (action.type) {
    case '장바구니에 추가':
      newState = [...state];
      index = newState.findIndex((item) => item.id === action.payload.id);

      if (index >= 0) {
        newState[index].quan++;
      } else {
        newState.push(action.payload);
      }

      return newState;

    case '수량 증가':
      newState = [...state];
      index = action.payload.index;

      newState[index].quan++;

      return newState;

    case '수량 감소':
      newState = [...state];
      index = action.payload.index;

      if (newState[index].quan > 0) {
        newState[index].quan--
      }

      return newState;

    default:
      return state;
  }
}

let store = createStore(combineReducers({ reducerOfCart }));

export default store;