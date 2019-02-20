import { Web3GetterName } from "./names";
import { GetterTree } from "vuex";
import { Web3State } from "./state";

const getters: GetterTree<Web3State, any> = {
  // get loading status
  [Web3GetterName.web3Loading](state) {
    return state.loading;
  },
  // get web3 initialize status
  [Web3GetterName.web3Initialize](state) {
    return state.initialized;
  },
  // get loading message
  [Web3GetterName.web3LoadingMessage](state) {
    return state.message;
  },
  // get user status
  [Web3GetterName.web3Status](state) {
    return state.status;
  }
};

export default getters;