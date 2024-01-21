import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import DataProvider from "./DataContext";
import Chat from "./screens/Chat";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import { DataContext } from "./DataContext";
import Profile from "./components/Profile";
import DbChatScreen from "./DbChat/DbChatScreen";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const Stack = createStackNavigator();

const selectDb = async () => {
  let result = await DocumentPicker.getDocumentAsync();
  if (result.type == "cancel") return;
  let fileUri = result.assets[0].uri;
  let fileInfo = await FileSystem.getInfoAsync(fileUri);

  const localUri = FileSystem.documentDirectory + "SQLite/surya.db";
  await FileSystem.copyAsync({
    from: fileUri,
    to: localUri,
  });
  console.log("Copied sql file");
};

function Main() {
  const {
    showModal,
    setShowModal,
    chats,
    setChats,
    getArrayFromAsyncStorage,
    setShowMenu,
  } = useContext(DataContext);
  useEffect(() => {
    // setChats([]);
    getArrayFromAsyncStorage("chats").then((data) => {
      if (data) setChats(data);
      console.log(data);
    });
  }, []);
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: "#ffffff",
          background: "#000000",
          card: "#060606",
          text: "#ffffff",
          border: "#ffffff",
          notification: "#000000",
        },
      }}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Whats App",
            // headerTitleAlign: "center",
            headerTitleContainerStyle: {
              paddingLeft: 5,
            },
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  console.log("wa icon press");
                }}
                onLongPress={() => {
                  console.log("wa icon -------- press");
                  selectDb();
                }}
              >
                <FontAwesome name="whatsapp" size={24} color="white" />
              </Pressable>
            ),
            headerLeftContainerStyle: {
              paddingLeft: 20,
            },
          }}
        />
        <Stack.Screen
          name={"Chat"}
          component={Chat}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={"Profile"}
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={"DbChatScreen"}
          component={DbChatScreen}
          options={{
            headerShown: false,
          }}
        />
        {/* {chats.map((chatItem, index) => (
          <Stack.Screen
            name={chatItem.chatWith}
            key={index}
            component={Chat}
            options={{
              headerRightContainerStyle: {
                paddingRight: 20,
              },
              headerRight: () => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setShowMenu(true);
                      }}
                    >
                      <Ionicons
                        name="ellipsis-vertical-sharp"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                );
              },
              headerRightContainerStyle: {
                paddingRight: 23,
              },
            }}
          />
        ))} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <DataProvider>
      <StatusBar style="light" />
      <Main />
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
