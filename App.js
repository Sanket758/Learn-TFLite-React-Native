import React, {Component} from 'react';
import  {View, Text, Image, StyleSheet} from  'react-native';
import {Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import Tflite from 'tflite-react-native';

let tflite = new Tflite();
var modelFile = 'models/model.tflite';
var labelsFile = 'models/labels.txt';

export default class NotHotDogApp extends Component{

    constructor(props){
        super(props);
        this.state = {
            recognitions: null,
            source: null,
        }
        tflite.loadModel({model: modelFile, labels: labelsFile}, (err, res)=>{
            if (err) console.log('error');
            else console.log(res);
        })
    }

    selectGalleryImage(){
        const options = {};
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel){
                console.log('User Cancelled');
            } else if(response.error){
                console.error('Error');
            }else if(response.customButton){
                console.log('Clicked a custom Button');
            } else{
                // console.log(response.uri)
                this.setState({
                    source: {
                        'uri': response.uri
                    }
                })
                tflite.runModelOnImage({
                    path:response.path,
                    imageMean: 128,
                    imageStd: 128,
                    numResults: 2,
                    threshold:0.8,
                }, (err, res) =>{
                    console.log(res[res.length - 1]);
                    this.setState({recognitions: res[res.length - 1]})
                })
            }
        })
    }

    takeImage(){
        const options = {};
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel){
                console.log('User Cancelled');
            } else if(response.error){
                console.error('Error');
            }else if(response.customButton){
                console.log('Clicked a custom Button');
            } else{
                // console.log(response.uri)
                this.setState({
                    source: {
                        'uri': response.uri
                    }
                })
                tflite.runModelOnImage({
                    path:response.path,
                    imageMean: 128,
                    imageStd: 128,
                    numResults: 2,
                    threshold:0.8,
                }, (err, res) =>{
                    console.log(res[res.length - 1]);
                    this.setState({recognitions: res[res.length - 1]})
                })
            }
        })
    }

    render() {
        const {recognitions, source} = this.state; 
        return(
            <LinearGradient colors={['#dd3e54', '#dd3e09']} style={styles.linearGradient}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}> NotHotDogApp </Text>  
                </View>
                <View style={styles.outputContainer}>
                    {
                        recognitions ? (
                            <View>
                                <Image source={source} style={styles.hotdog}></Image>
                                <Text
                                    style={{
                                        color: 'white',
                                        textAlign: 'center', 
                                        paddingTop: 10,
                                        fontSize: 25,
                                    }}
                                >
                                {recognitions['label'] + ' - ' + (recognitions['confidence'] * 100).toFixed(0) + '%' }
                                </Text>
                            </View>
                        ) : (
                            <View>
                                <Image source={require('./assets/hotdog.png')} style={styles.hotdog}></Image>
                            </View>
                        )
                    }
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        title='Camera'
                        titleStyle={{fontSize: 20}}
                        containerStyle={{margin: 5}}
                        buttonStyle={styles.button}
                        onPress={this.takeImage.bind(this)}></Button>
                    <Button 
                        title='Choose from gallery'
                        titleStyle={{fontSize: 20}}
                        containerStyle={{margin: 5}}
                        buttonStyle={styles.button}
                        onPress={this.selectGalleryImage.bind(this)}></Button>
                </View>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    linearGradient: {
        flex:1,
    },
    titleContainer:{
        marginTop:70,
        marginLeft:40,
    },
    title:{
        fontSize: 40,
        fontWeight: 'bold',
    },
    outputContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer:{
        paddingBottom: 40,
        alignItems: 'center',
    },
    button:{
        width: 250,
        height: 57,
        backgroundColor: 'black',
        borderRadius: 50,
    },
    hotdog:{
        width: 200,
        height: 200,
    },
})