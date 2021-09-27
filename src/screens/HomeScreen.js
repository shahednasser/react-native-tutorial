import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import Toast from 'react-native-toast-message';

export default function HomeScreen ({ navigation }) {
  const { getItem } = useAsyncStorage('todo');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function getTodoList () {
    getItem()
      .then((todoJSON) => {
        const todo = todoJSON ? JSON.parse(todoJSON) : [];
        setItems(todo);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'An error occurred',
          position: 'top'
        });
      });
  }

  function renderCard ({item}) {
    return (
      <Card>
        <Card.Title style={styles.cardTitle}>{item.title}</Card.Title>
      </Card>
    )
  }
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getTodoList);

    return unsubscribe;
  }, [])

  return (
    <View>
      <FlatList refreshing={loading} onRefresh={getTodoList} style={styles.list} data={items} 
        renderItem={renderCard} keyExtractor={(item) => item.id} />
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    width: '100%'
  },
  cardTitle: {
    textAlign: 'left'
  }
})