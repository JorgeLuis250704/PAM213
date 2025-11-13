import { View, Text, StyleSheet, SectionList } from 'react-native'
import React from 'react'

const houses = [
    {
        title: 'DC Comics', 
        data: [
            'Superman',
            'Batman',
            'Wonder Woman',
        ],
    },
    {
        title: 'Marvel Comics',
        data: [
            'Spider-Man',
            'Iron Man',
            'Captain America',
        ],
    }
];

const MySectionList = () => {
  return (
    <View style={styles.container}>
      <SectionList
        sections={houses}
        keyExtractor={(item, index) => item + index} 
        
        renderItem={({ item }) => (
            <Text style={styles.item}>{item}</Text> 
        )}
        
        renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>
                {section.title}
            </Text>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        marginTop: 20,
    },
    item: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 16, 
    },
    sectionHeader: { 
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontWeight: 'bold', 
        fontSize: 18, 
    },
});

export default MySectionList;