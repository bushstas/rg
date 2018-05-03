import {get, post} from '../utils/Fetcher';
import {IBattleData} from '../models';

const init = () => {
  return {
      fetching: true
  };
}

 const load = ({setState}) => {
  get('load_battle')
    .then((data: IBattleData) => {
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