import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useContext, memo, useState } from "react";
import { DataContext } from "../DataContext";
import WaInput from "../components/WaInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Menu from "../components/Menu";
import SaveDialog from "../components/SaveDialog";
import Save from "../components/Save";
export default function Chat({ route, navigation }) {
  const { data, setData, names, setChats, showMenu, setShowMenu } =
    useContext(DataContext);
  const { chatItem } = route.params;
  const [direction, setDirection] = useState(chatItem.direction || 0);
  const [inverted, setInverted] = useState(true);
  const [focus, setFocus] = useState(false);
  const [mssg, setMssg] = useState("");

  function sendMessge(newMssg) {
    setData([
      ...data,
      { name: names[direction], date: "12:00", mssg: newMssg },
    ]);
  }
  return (
    <View style={{ flex: 1, marginTop: 0 }}>
      {/* <SaveDialog /> */}
      <Save date={chatItem.date} />
      <Menu
        {...{
          navigation,
          showMenu,
          setShowMenu,
          setInverted,
          setDirection,
          setChats,
          name: chatItem.chatWith,
          inverted,
        }}
      />

      {inverted ? (
        <FlatList
          inverted={true}
          data={[...data].reverse()}
          renderItem={(itemData, index) => {
            if (itemData.item.name === names[direction])
              return <ChatA itemData={itemData} />;
            else return <ChatB itemData={itemData} />;
          }}
          keyExtractor={(item, index) => "inverted" + index.toString()}
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
      <WaInput sendMessge={sendMessge} />
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
});
