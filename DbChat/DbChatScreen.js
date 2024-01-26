import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { memo, useState, useContext } from "react";
import { DataContext } from "../DataContext";
import { StatusBar } from "expo-status-bar";
import DbChatTopBar from "./DbChatTopBar";
import { PermissionsAndroid } from "react-native";
import DbMessg from "./DbMessg";
import WaInput from "../components/WaInput";
export default function DbChatScreen({ navigation, route }) {
  const { dbChat, setDbChat } = useContext(DataContext);
  const { chatItem } = route.params;
  return (
    <View style={s.container}>
      <StatusBar backgroundColor="#000000" />
      <DbChatTopBar chatItem={chatItem} navigation={navigation} />
      <FlatList
        inverted={true}
        data={[...dbChat].reverse()}
        renderItem={(itemData, index) => {
          return <DbMessg item={itemData.item} />;
        }}
        keyExtractor={(item, index) => "inverted" + index.toString()}
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={500}
        // onEndReached={loadMoreData}
        // onEndReachedThreshold={0.5}
      />
      <WaInput
        sendMessge={(mssg) => {
          setDbChat((prv) => [...prv, { me: 1, mssg }]);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  m: {
    backgroundColor: "blue",
    // width: "70%",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    width: "100%",
  },

  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#0e0f10",
    borderRadius: 10,
    alignItems: "center",
    color: "#fff",
    textColor: "#fff",
  },
  input: {
    width: "100%",
    padding: 10,
    color: "#fff",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 8,
  },
  popupTextHead: {
    color: "#d3d3d3",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
    margin: 0,
  },
  btn: {
    // backgroundColor: "#171616",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 4,
  },
  btnText: {
    color: "#dedede",
    fontSize: 16,
  },
});
