import { web3Instance } from "src/boot/web3";
import {
  FILENAME,
  loadAllContract,
  loadSpecificContract
} from "src/contracts/contract";
import { errorNotification } from "src/helper/notifications";
import { range } from "src/helper/utils";
import { ActionTree } from "vuex";
import { ContractActionName, ContractMutationName } from "./names";
import { ContractState } from "./state";

const actions: ActionTree<ContractState, any> = {
  /** [Private] Setup ETH Address */
  async [ContractActionName.setupAddress]({ commit, rootState }) {
    let acc: string[];
    if (rootState.route.query.address) {
      acc = [rootState.route.query.address];
    } else {
      acc = await web3Instance.getAvailableAddress();
    }
    commit(ContractMutationName.setAddress, acc[0]);
  },
  /** [Private] Load all NFTs (with img id) */
  async [ContractActionName.loadAllNfts]({ state, commit }, name: string) {
    const numArr = range(0, state.contractDetails[name].balance);
    const {
      genImg,
      getSupportImgShortcut
      // getNft
    } = await import(`src/contracts/contract/${name}/contract.ts`);
    numArr.forEach(async (key) => {
      const tokenId = await web3Instance.getTokenWithId(state.address, key);
      commit(ContractMutationName.addNftIds, { name, id: tokenId });
      if (getSupportImgShortcut()) {
        commit(ContractMutationName.setNftImages, {
          id: tokenId,
          image: genImg({ id: tokenId })
        });
      } else {
        // make RPC call
        const uri = await web3Instance.getURI(tokenId);
        const res = await fetch(uri);
        const jsonData = await res.json();
        commit(ContractMutationName.setNftImages, {
          id: tokenId,
          image: genImg({ id: tokenId }, jsonData)
        });
      }
    });
  },
  /** Load all JSON Contract JSON data */
  async [ContractActionName.loadAllJson]({ state, commit }) {
    const jsonData = await loadAllContract();
    commit(ContractMutationName.setContractsData, {
      contracts: jsonData,
      names: FILENAME,
    });
  },
  /** Load Specific JSON Contract data */
  async [ContractActionName.loadSpecificJson](
    { commit },
    name: string
  ) {
    const jsonData = await loadSpecificContract(name);
    commit(ContractMutationName.setSpecificContractData, {
      name,
      contract: jsonData
    });
  },
  /** Update an array NFTs on balance (use in main page) */
  async [ContractActionName.updateBalance]({ state, commit }) {
    const acc = state.address;
    for (const contract of Object.keys(state.contractDetails)) {
      const { address, name, abi } = state.contractDetails[contract];
      await web3Instance.setContract({ abiAddress: abi, address, acc });
      const bal = await web3Instance.getBalance(acc);
      commit(ContractMutationName.setContractsBalance, { name, bal });
    }
  },
  /** Load all JSON Contract data */
  async [ContractActionName.loadAllContracts]({ state, commit, dispatch }) {
    commit(ContractMutationName.setLoading, true);
    commit(ContractMutationName.updateCompKey);
    if (state.address === "") {
      await dispatch(ContractActionName.setupAddress);
    }
    await dispatch(ContractActionName.loadAllJson);
    const acc = state.address;
    if (acc === "") {
      errorNotification("contract.error.no_acc");
      commit(ContractMutationName.setLoading, false);
      return;
    }
    dispatch(ContractActionName.updateBalance);
    commit(ContractMutationName.setLoading, false);
  },
  async [ContractActionName.loadSpecificContract](
    { state, commit, dispatch },
    name: string
  ) {
    if (state.address === "") {
      await dispatch(ContractActionName.setupAddress);
    }
    await dispatch(ContractActionName.loadSpecificJson, name);
    const acc = state.address;
    if (acc === "") {
      errorNotification("contract.error.no_acc");
      commit(ContractMutationName.setLoading, false);
      return;
    }
    const { address, abi } = state.contractDetails[name];
    await web3Instance.setContract({ abiAddress: abi, address, acc });
    const bal = await web3Instance.getBalance(acc);
    commit(ContractMutationName.setContractsBalance, { name, bal });
    if (bal === 0) {
      return;
    }
    dispatch(ContractActionName.loadAllNfts, name);
  }
};

export default actions;
