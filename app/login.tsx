import { View, Text, TextInput, TouchableOpacity ,StyleSheet, Image } from 'react-native'
import React,{ useState, useEffect }  from 'react'
import { auth } from '../utils/FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,getAuth } from 'firebase/auth'
import { useRouter } from 'expo-router'
import SplashScreen from './splashscreen';


export default function login() {



const router = useRouter();   
const [email , setEmail] = useState("")
const [password, setPassword] = useState("")
const [isLoading, setIsLoading] = useState(true);


useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      router.push('./(app)');
    } else {
      setIsLoading(false); // Stop loading if no user is found
    }
  });

  return unsubscribe; // Cleanup the subscription
}, [router]);

const LogIn = async () => {
  setIsLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.log(error)
      alert('Log In failed: ' + error.message);
    }finally {
      setIsLoading(false); 
    }

  }

  const SignUp = async () => {
    setIsLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      setIsLoading(true)
      if (user) router.replace('/welcome');
    } catch (error: any) {
      console.log(error)
      alert('Sign Up failed: ' + error.message);
    }finally {
      setIsLoading(false); 
    }
  }

  if (isLoading) {
    return <SplashScreen />; 
  }



  return (
    
    <View style = {styles.container}>

      <Image source={require('../assets/images/Vector.png')} style={styles.image} />
      <TextInput
      style={styles.input}
      value = {email}
      onChangeText={setEmail}
      placeholder="Email"
      />
      <TextInput
      style={styles.input}
      value = {password}
      onChangeText={setPassword}
      placeholder="Password"
      secureTextEntry={true}
      />
     <TouchableOpacity onPress={LogIn} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={SignUp} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
    container:{
        width: "100%",
        height: "100%",
        backgroundColor: "#343541",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Raleway",
        color: "white",
        gap: 15,
        fontSize: 30,
        
    },
    input:{
        width:"70%",
        borderWidth:2,
        borderRadius:10,  
        borderColor: "#FFFFFF52",   
        backgroundColor: "#FFFFFF1A",
        color: "white"
    },
    button:{
        width:"70%",
        borderWidth:2,
        borderRadius:10,  
        borderColor:"white",
        backgroundColor:"black",
        padding:8,
        

    },
    buttonText: {
        color: "white", // 👈 Change text color here
        fontSize: 16,
        fontWeight: "bold",
        alignSelf:"center"
      },
      image: {
        marginTop: 25,
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
});