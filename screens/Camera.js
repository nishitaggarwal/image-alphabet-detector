import * as React from 'react';
import {Button,Image, View, Platform, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component {
constructor(){
    super()
    this.state = {image:null}
}


getPermissionsAsync = async () => {
    if(Platform.OS !== "web"){
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(status !== "granted"){
            Alert.alert("Sorry we need camera Roll permissions to make this work")
        }
    }
}

uploadImage  = async (uri) =>{
    const data = new FormData()
    let fileName  = uri.split("/")[uri.split("/").length - 1]

    let type = `image/${uri.split(".")[uri.split(".").length - 1 ]}`
    const file_to_upload = {

        uri:uri,
        name:fileName,
        type:type
    }
    data.append("digit",file_to_upload)
    fetch("http://127.0.0.1:5000/",{method : "POST", body: data, headers:{"content-type":"mutlipart/form-data"}})
    .then(response => response.json()).then(result => {console.log("Success:", result)})
    .catch(error => console.log(error))
}

pickTheImage = async () => {
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          if (!result.cancelled) {
           this.setState({image:result.data})
           
            this.uploadImage(result.uri);
          }
    } catch (error) {
        console.log(error)
    }
}

componentDidMount(){
        this.getPermissionsAsync()
}


render(){
    return(
            <View style = {{
                flex:1,
                alignItems:'center',
                justifyContent:'center'
            }}>
                <Button title = "Pick an Image from camera roll" onPress={this.pickTheImage} />
            </View>
    )
}

}