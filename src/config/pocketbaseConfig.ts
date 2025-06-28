import PocketBase from "pocketbase";

const pbInstanceMap = {
  pbLocal: () => new PocketBase("http://0.0.0.0:8090"),
  pbRemote: () => new PocketBase("https://pokkit-realtime-chat.pockethost.io"),
};

export const pb = pbInstanceMap.pbLocal();
pb.autoCancellation(false);
