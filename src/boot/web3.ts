import { Web3Class } from "src/helper/class/Web3Class";
// @ts-ignore
import store from "src/store";
import { BootInput } from "../types/boot";

let web3Instance: Web3Class;
let currentWeb3Address = "";

// leave the export, even if you don't use it
export default async ({ Vue }: BootInput) => {
  web3Instance = new Web3Class();
  // Vuex Watch for sign in

  // let tempAccInterval: any = null;
  // store.watch(
  //   (newValue: any, oldValue: any) => {
  //     if (!(oldValue.web3 && newValue.web3.status === oldValue.web3.status)) {
  //       // if account switch
  //       if (newValue.web3.status === "login") {
  //         const checkAccInterval = () =>
  //           setInterval(async () => {
  //             const addresses = await web3Instance.getAvailableAddress();
  //             const needUpdate =
  //               currentWeb3Address !== addresses[0] &&
  //               currentWeb3Address !== "";
  //             currentWeb3Address = addresses[0];
  //             const newAddress = newValue.contract.address;
  //             if (needUpdate && newAddress !== currentWeb3Address) {
  //               // If Metamask account change, reload.
  //               location.reload();
  //             }
  //           }, 2000);
  //         tempAccInterval = checkAccInterval();
  //       } else if (newValue.web3.status === "logout") {
  //         if (tempAccInterval !== null) {
  //           clearInterval(tempAccInterval);
  //         }
  //       }
  //     }
  //   },
  //   () => {}
  // );
};

export { web3Instance };
