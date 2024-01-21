import { View, Text, StyleSheet, FlatList } from "react-native";
import { memo, useState, useContext } from "react";
import { DataContext } from "../DataContext";
import { StatusBar } from "expo-status-bar";
import DbChatTopBar from "./DbChatTopBar";
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
          if (itemData.item.me === 1) return <ChatA itemData={itemData} />;
          else return <ChatB itemData={itemData} />;
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

const ChatA = memo(({ itemData }) => {
  return (
    <View style={[, s.textOuter, s.textOuterA]}>
      <Text style={[s.textMssg, s.textMssgA]}>{itemData.item.mssg}</Text>
    </View>
  );
});
const ChatB = memo(({ itemData }) => {
  return (
    <View style={[, s.textOuter, s.textOuterB]}>
      <Text style={[s.textMssg, s.textMssgB]}>{itemData.item.mssg}</Text>
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    width: "100%",
  },

  textOuter: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 8,
  },
  textOuterA: {
    justifyContent: "flex-end",
    paddingRight: 7,
  },
  textOuterB: {
    justifyContent: "flex-start",
    marginLeft: 7,
  },

  textMssg: {
    maxWidth: "82%",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 15,
  },
  textMssgA: {
    backgroundColor: "#005c4b",
    backgroundColor: "#1e1920",
  },
  textMssgB: {
    backgroundColor: "#202c33",
    backgroundColor: "#1b2023",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
