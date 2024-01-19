import { createContext, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DataContext = createContext();

export default function DataProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [data, setData] = useState([]);
  const [names, setNames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // if (chats.length > 0) saveArrayToAsyncStorage("chats", chats);
    saveArrayToAsyncStorage("chats", chats);
  }, [chats]);

  const saveDataToFile = async (data, fileName) => {
    try {
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Function to retrieve data from a file
  const retrieveDataFromFile = async (fileName) => {
    try {
      const fileUri = FileSystem.documentDirectory + fileName;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const data = JSON.parse(fileContent);
      console.log("Data retrieved successfully!");
      return data;
    } catch (error) {
      console.error("Error retrieving data:", error);
      return null;
    }
  };

  const saveArrayToAsyncStorage = async (key, array) => {
    try {
      const jsonValue = JSON.stringify(array);
      await AsyncStorage.setItem(key, jsonValue);
      console.log("Array saved successfully!");
    } catch (error) {
      console.error("Error saving array:", error);
    }
  };

  const getArrayFromAsyncStorage = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        const array = JSON.parse(jsonValue);
        console.log("Array retrieved successfully!");
        return array;
      }
    } catch (error) {
      console.error("Error retrieving array:", error);
    }
    return null;
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        chats,
        setChats,
        names,
        setNames,
        showModal,
        showMenu,
        setShowMenu,
        setShowModal,
        saveDataToFile,
        retrieveDataFromFile,
        saveArrayToAsyncStorage,
        getArrayFromAsyncStorage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext };
