import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  Pressable,
  TextInput,
  SafeAreaView,
  Image,
  StatusBar as Sb,
  TouchableOpacity,
  TouchableHighlightBase,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useContext, memo, useState } from "react";
import { DataContext } from "../DataContext";
import WaInput from "../components/WaInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Menu from "../components/Menu";
import SaveDialog from "../components/SaveDialog";
import Save from "../components/Save";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Ripple } from "react-native-material-ripple";
import Profile from "../components/Profile";
export default function Chat({ route, navigation }) {
  const {
    data,
    setData,
    names,
    setChats,
    showMenu,
    setShowMenu,
    getImageFile,
    setShowModal,
  } = useContext(DataContext);
  const { chatItem, notSaved } = route.params;
  const [direction, setDirection] = useState(chatItem.direction || 0);
  const [inverted, setInverted] = useState(true);
  const [focus, setFocus] = useState(false);
  const [mssg, setMssg] = useState("");
  const [showProifle, setShowProfile] = useState(false);
  function sendMessge(newMssg) {
    setData([
      ...data,
      { name: names[direction], date: "12:00", mssg: newMssg },
    ]);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#000000" />
      {/* <Profile
        chatItem={chatItem}
        showProfile={showProifle}
        setShowProfile={setShowProfile}
      /> */}
      <View style={i.topbar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <MaterialIcons
            style={{
              paddingHorizontal: 8,
              paddingVertical: 5,
              marginRight: 2,
            }}
            name="chevron-left"
            size={28}
            color="white"
          />
        </TouchableOpacity>
        <Pressable
          onPress={() => {
            console.log("clicked");
            // setShowProfile(true);
            navigation.navigate("Profile", { chatItem });
          }}
        >
          <View style={i.head}>
            {chatItem.hasImg ? (
              <Image
                source={{
                  uri: getImageFile(
                    `${chatItem.chatWith}|x|${chatItem.chatFrom}`,
                    "thumb"
                  ),
                }}
                style={{ width: 40, height: 40, borderRadius: 50 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="face-man-profile"
                size={38}
                color="white"
              />
            )}
            <Text style={i.title}>{chatItem.chatWith}</Text>
          </View>
        </Pressable>

        <View style={i.headerItems}>
          {notSaved && (
            <Pressable
              onPress={() => {
                setShowModal(true);
              }}
            >
              <MaterialIcons
                name="save-alt"
                size={24}
                color="white"
                style={{ paddingVertical: 4, paddingHorizontal: 6 }}
              />
            </Pressable>
          )}
          <TouchableOpacity
            onPress={() => {
              setShowMenu(true);
            }}
          >
            <Ionicons
              style={{ paddingVertical: 4, paddingHorizontal: 6 }}
              name="ellipsis-vertical-sharp"
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
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
            chatItem,
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
    </SafeAreaView>
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

const i = StyleSheet.create({
  topbar: {
    paddingLeft: 7,
    paddingVertical: 4,
    paddingBottom: 8,
    backgroundColor: "#000",
    marginTop: Sb.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.3,
    borderColor: "#4f4f4f",
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
    gap: 12,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
  },
  headerItems: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingRight: 20,
  },
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
