import { Picker } from '@react-native-picker/picker';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../navigation/DrawerNavigator';
import { Parent } from './ParentsScreen';

type Props = DrawerScreenProps<DrawerParamList, 'EditParent'>;

const EditParentScreen = ({ route, navigation }: Props) => {
  const { parent } = route.params;

  const [name, setName] = useState(parent.name);
  const [cpf, setCpf] = useState(parent.cpf);
  const [email, setEmail] = useState(parent.email);
  const [parentesco, setParentesco] = useState<Parent['parentesco']>(parent.parentesco);
  const [responsavelFinanceiro, setResponsavelFinanceiro] = useState(parent.responsavel_financeiro);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(parent.name);
    setCpf(parent.cpf);
    setEmail(parent.email);
    setParentesco(parent.parentesco);
    setResponsavelFinanceiro(parent.responsavel_financeiro);
  }, [parent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:8000/responsavel/${parent.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          cpf,
          email,
          parentesco,
          responsavel_financeiro: responsavelFinanceiro,
        }),
      });
      navigation.navigate('Parents');
    } catch (error) {
      console.error('Erro ao atualizar responsável:', error);
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar responsável</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Parentesco</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={parentesco}
          onValueChange={(value) => setParentesco(value)}
        >
          <Picker.Item label="Pai" value="pai" />
          <Picker.Item label="Mãe" value="mae" />
          <Picker.Item label="Avô/Avó" value="avo" />
          <Picker.Item label="Tio/Tia" value="tio" />
          <Picker.Item label="Responsável Legal" value="responsavel_legal" />
        </Picker>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Responsável financeiro</Text>
        <Switch
          value={responsavelFinanceiro}
          onValueChange={setResponsavelFinanceiro}
          trackColor={{ false: '#ccc', true: '#4B7BE5' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.buttonContainer}>
        {saving ? (
          <ActivityIndicator size="large" color="#4B7BE5" />
        ) : (
          <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Voltar" onPress={() => navigation.navigate('Parents')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 12,
  },
});

export default EditParentScreen;