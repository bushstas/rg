import {get, post} from '../utils/Fetcher';
import {ITravelData} from '../models';

const init = () => {
  return {
      fetching: true
  };
}

 const load = ({setState}) => {
  get('load_travel')
    .then((data: ITravelData) => {
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