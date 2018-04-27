import {get, post} from '../utils/Fetcher';

const init = () => {
  return {
      fetching: true
  };
}

 const load = ({setState}) => {
  get('load_battle')
    .then((data) => {
        setState({
          ...data,
          fetching: false
        });
    });
}

export default {
  actions: {
  	load
  },
  reducers: {
    init
  }
}