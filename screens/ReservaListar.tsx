import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, ImageBackground} from 'react-native';
import { TextInput } from 'react-native-paper';
import { auth, firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import styles from '../estilo';

import { Picker } from '@react-native-picker/picker';

import { Resvaga } from '../model/Resvaga';


export default function ListarResvaga() {
    const [reserva, setReserva] = useState<Resvaga[]>([]); //array de vagas
    const navigation = useNavigation();

    const refResvaga = firestore.collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Resvaga")

    useEffect( () => {
        listar();
    })

    const listar = () => {
        const subscriber = refResvaga
        .onSnapshot( (query) => { 
            const reserva = [];
            query.forEach((documento) => {
                reserva.push({
                    ...documento.data(),
                    key: documento.id
                });
            });
            setReserva(reserva);
        })
        return () => subscriber();
    }

    const excluir = async(item) => {
        const resultado = await refResvaga
         .doc(item.id)
         .delete()
         .then( () => {
            alert('Excluído com sucesso!')
            listar()
         })
    }

    const editar = 
    (item: Resvaga) => {
        navigation.navigate
        ("Cadastro de Reserva", {resvaga:item});
    }

    return (
        <ImageBackground source={require('../assets/tela.png')} resizeMode='stretch' style={styles.container}>
            <FlatList
                data={reserva}
                renderItem={ ({item}) => (
                    <TouchableOpacity style={styles.listItem}
                        onPress={ () => editar(item) }
                        onLongPress={ () => excluir(item) }
                    >
                         <Text style={styles.listText}>Data: {item.data}</Text>
                        <Text style={styles.listText}>Tipo: {item.tipo}</Text>
                        <Text style={styles.listText}>Vaga: {item.vaga}</Text>
                    </TouchableOpacity>
                )}
            />
        </ImageBackground>
    )
}