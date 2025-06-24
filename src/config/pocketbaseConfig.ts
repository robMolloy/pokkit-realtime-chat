import PocketBase from "pocketbase";

const pbInstanceMap = {
  pbLocal: () => new PocketBase("http://127.0.0.1:8090"),
  pbRemote: () => new PocketBase("https://pokkit-realtime-chat.pockethost.io"),
};

export const pb = pbInstanceMap.pbRemote();
pb.autoCancellation(false);
