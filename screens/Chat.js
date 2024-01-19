import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useContext, memo, useState } from "react";
import { DataContext } from "../DataContext";
import { TextInput } from "react-native-gesture-handler";
import WaInput from "../components/WaInput";
export default function Chat({ route, navigation }) {
  const {
    data,
    setData,
    names,
    showModal,
    setShowModal,
    chats,
    setChats,
    saveDataToFile,
    showMenu,
    setShowMenu,
    retrieveDataFromFile,
    saveArrayToAsyncStorage,
    getArrayFromAsyncStorage,
  } = useContext(DataContext);
  const [newChatName, setNewChatName] = useState("");
  const [direction, setDirection] = useState(0);
  const [inverted, setInverted] = useState(true);
  const { name = "none" } = route.params;

  function sendMessge(newMssg) {
    setData([
      ...data,
      { name: names[direction], date: "12:00", mssg: newMssg },
    ]);
  }
  return (
    <View style={{ flex: 1, marginTop: 0 }}>
      <Modal transparent={true} visible={showModal} animationType="slide">
        <View style={s.modalContainer}>
          <View style={s.modalContent}>
            <Text style={s.popupTextHead}>Save File As</Text>
            <TextInput
              value={newChatName}
              onChangeText={setNewChatName}
              style={s.input}
            />
            <View style={s.buttons}>
              <Btn title="Cancel" onPress={() => setShowModal(false)} />
              <Btn
                title="Save"
                onPress={() => {
                  if (chats.find((item) => item.name === newChatName))
                    alert("Chat name already exists");
                  else {
                    setShowModal(false);
                    setChats([
                      ...chats,
                      {
                        name: newChatName,
                        date: data[data.length - 1].date,
                        mssg: data[data.length - 1].mssg,
                      },
                    ]);
                    saveDataToFile(data, newChatName);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={showMenu} animationType="none">
        <View style={s.menuContainer}>
          <Pressable style={{ flex: 1 }} onPress={() => setShowMenu(false)}>
            <View style={s.b}>
              <Pressable onPress={() => {}}>
                <View style={s.menuContent}>
                  <MenuItem
                    title={inverted ? "Go Top" : "Go Bottom"}
                    onPress={() => {
                      setInverted((prev) => !prev);
                      setShowMenu(false);
                    }}
                  />
                  <MenuItem
                    title="swap"
                    onPress={() => {
                      setDirection((prev) => (prev === 0 ? 1 : 0));
                      setShowMenu(false);
                    }}
                  />
                  <MenuItem
                    title="Delete Chat"
                    onPress={() => {
                      setChats((chats) =>
                        chats.filter((item) => item.name !== name)
                      );
                      navigation.navigate("Home");
                      setShowMenu(false);
                    }}
                  />
                </View>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Modal>

      {inverted ? (
        <FlatList
          inverted={true}
          data={[...data].reverse()}
          renderItem={(itemData, index) => {
            if (itemData.item.name === names[direction])
              return <ChatA itemData={itemData} />;
            else return <ChatB itemData={itemData} />;
          }}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={10}
          windowSize={10}
          maxToRenderPerBatch={500}
          // onEndReached={loadMoreData}
          // onEndReachedThreshold={0.5}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={(itemData, index) => {
            if (itemData.item.name === names[direction])
              return <ChatA itemData={itemData} />;
            else return <ChatB itemData={itemData} />;
          }}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={10}
          windowSize={10}
          maxToRenderPerBatch={500}
          // onEndReached={loadMoreData}
          // onEndReachedThreshold={0.5}
        />
      )}

      <View>
        <WaInput sendMessge={sendMessge} />
      </View>
    </View>
  );
}

function Btn({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={s.btn}>
        <Text style={s.btnText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function MenuItem({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={s.menuItem}>{title}</Text>
    </TouchableOpacity>
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
  menuContainer: {
    flex: 1,
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
    // backgroundColor: "rgba(0, 0, 0, 0.7)",
    // backgroundColor: "#180000",
  },
  b: {
    flex: 1,
  },
  menuContent: {
    position: "absolute",
    right: 10,
    top: 50,
    minWidth: 150,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#0e0f10",
    // backgroundColor: "blue",
    borderRadius: 10,
    color: "#fff",
    textColor: "#fff",
  },
  menuItem: {
    color: "#a4a4a4",
    // backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 17,
  },
});
