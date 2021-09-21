import React, {useState} from 'react';
import { Text, View, StyleSheet, SafeAreaView, Header, Modal, Pressable, Image, ScrollView, FlatList, Animated} from 'react-native';
import Constants from 'expo-constants';


async function executeGet(url,jsonState){

    await fetch(url)
    .then(response => {
          if (response.status === 200) {

            response.json().then(function(result){ 

              jsonState(result)

              });
          } else {
            throw new Error('Erro ao consumir a API!');
          }
      })
      .then(response => {
      }).catch(error => {
        console.error(error);
      });
  }


const ShowDetalhes = ({display,toogleModal,mensagem}) => (   
    <Modal
          animationType="slide"
          transparent={true}
          visible={display}
          onRequestClose={toogleModal}
    >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
                <Pressable onPress={toogleModal}>
                  <Text>{mensagem}</Text>
                </Pressable>
          </View>
        </View>
    
    </Modal>
        
 )
 
 const User = ({nome, email, phone}) => {
    
    const [modal,setModal] = React.useState(false)

    function mudaModal(){
      setModal(!modal)
    }

    return(
    <View>
      <ShowDetalhes display={modal} toogleModal={mudaModal} mensagem={email}/>
      
      <Pressable onPress={mudaModal}>
        <Text style={styles.paragraph}>{nome}</Text>
        <Text style={styles.paragraph}>{phone}</Text>
      </Pressable>
    </View>
    )
}

export default function App() {

  const [scrollY, setScrollY] = useState(new Animated.Value(0))

  const [jsonData,setJsonData] = React.useState({})

  executeGet("https://fakestoreapi.com/users",setJsonData)
  //função que renderiza cada item do FlatList
  function meuItem({item}){
    
    let nomeCompleto = item.firstname + " " + item.lastname

    return(

      <User nome={nomeCompleto} 
            phone={item.phone}
            email={item.email}
      />
    )
  }


  return (

    

    <SafeAreaView style={{backgroundColor: '#101010'}}>
     <Animated.View style={[
       styles.header,
     {
       height: scrollY.interpolate({
         inputRange:[10, 160,185],
         outputRange: [140, 20, 0],
         extrapolate: 'clamp',
       }),
       opacity: scrollY.interpolate({
         inputRange: [1, 75, 170],
         outputRange: [1,1,0],
         extrapolate: 'clamp'
       })
     }]}>
        <Image 
        source={require('./assets/menu.png')}
        style={{width: 50, height: 50}}
        resizeMode='contain'
        />
        <Animated.Image 
        source={require('./assets/titulo.png')}
        style={{
        width: scrollY.interpolate({
          inputRange:[0, 120],
          outputRange:[180, 90]
        }), 
        height: 90}}
        resizeMode='contain'
        />
        <Image 
        source={require('./assets/home.png')}
        style={{width: 50, height: 50}}
        resizeMode='contain'
        />
     </Animated.View>

     <ScrollView 
     scrollEventThrottle={16}
     onScroll={Animated.event([{
       nativeEvent: {
         contentOffset: {y: scrollY}
       },

     }],
     {useNativeDriver: false})
     
     
     }>

     <View style={styles.box}>
     
     <FlatList
        data={jsonData}
        renderItem={meuItem}
        keyExtractor={item => item.id}
      />
     
     </View>

     <View style={styles.box}></View>
     <View style={styles.box}></View>
     <View style={styles.box}></View>
     <View style={styles.box}></View>

     </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF'
  },
    paragraph: {
    margin: 12,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'grey'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  box:{
    height: 300,
    backgroundColor: '#DDD',
    margin: 7,
    borderRadius: 5
  }
});
