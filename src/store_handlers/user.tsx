import {get, post} from '../utils/Fetcher';

const init = () => {
  return {
      location: null,
      token: null,
      fetching: false
  };
}
 
const load = ({setState}) => {
  get('load_user')
    .then(setState);
}

const login = ({setState}, data) => {
  post('login_user', data)
    .then(setState);
}

export default {
  localStore: {
    key: 'user',
    names: ['token']
  },
  actions: {
  	load,
    login
  },
  reducers: {
    init
  }
}