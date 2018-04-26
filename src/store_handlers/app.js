import {get} from '../utils/Fetcher';

const init = () => {
  return {
      location: 'battle',
      page: 'battle'
  };
}
 
const change = ({setState}, data) => {
  setState(data);
}

const show = ({setState}, shown) => {
  setState({shown});
}

const hide = ({setState}) => {
  setState({shown: null});
}

// const load_dictionary = ({setState, state}) => {
//   if (state.dict && state.icons) {
//     setDictionary(state);
//     return Promise.resolve();
//   }
//   return get('dictionary')
//   .then(data => {
//     setState(data);
//     setDictionary(data);
//   });
// }

export default {
  localStore: {
    key: 'app'
  },
  actions: {
  	change,
    show,
    hide,
    //load_dictionary
  },
  reducers: {
    init
  }
}