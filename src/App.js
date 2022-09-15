import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { useEffect, useState } from 'react';
import moment from "moment";

function App() {
  const baseUrl = "http://localhost:5000/api/users";

  const [errorMessage, setErrorMessage] = useState("");

  const [data,setData] = useState();
  const [selectedUser, setSelectedUser] = useState({
    id: "",
    nombre: "",
    fechanacimiento: null,
    numidentificacion: null,
  });

  //Inputs handlers
  const handleChange = (e) => {
    const {name, value} = e.target;
    console.log(name, value)
    setSelectedUser({
      ...selectedUser,
      [name]: value
    })
    console.log(selectedUser)
  }



  //Modal states
  const [modalCreateUser, setModalCreateUser] = useState(false);
  const [modalEditUser, setModalEditUser] = useState(false);
  const [modalDeleteUser, setModalDeleteUser] = useState(false);


  //Open and close modals actions
  const openCloseModalCreateUser = () => {
    setSelectedUser({
      id: "",
      nombre: "",
      fechanacimiento: null,
      numidentificacion: null,
    })
    setModalCreateUser(!modalCreateUser);

    setErrorMessage("");
  }
  const openCloseModalEditUser = () => {
    setModalEditUser(!modalEditUser)
  }
  const openCloseModalDeleteUser = () => {
    setModalDeleteUser(!modalDeleteUser)
  }


  // Petitions

  const getUserList = async() => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data.users);
      }).catch(error => {
          console.log(error);
      })
  }

  
  const postUser = async () => {
    setErrorMessage("");
    if(selectedUser.nombre == "" || selectedUser.fechanacimiento == null || selectedUser.numidentificacion == null) {
      return setErrorMessage("All fields are required!");
    }

    let aux=false;
    data.map(user => {
      console.log(user.numidentificacion)
      if(parseInt(selectedUser.numidentificacion) === parseInt(user.numidentificacion)){
        aux = true;
      }
    })
    if(aux === true) {
      return setErrorMessage(`User with identification number ${selectedUser.numidentificacion} was already created!`);
    }else{
      delete selectedUser.id;
      selectedUser.numidentificacion = parseInt(selectedUser.numidentificacion);
      await axios.post(baseUrl, selectedUser)
        .then(response=> {
          setData(data.concat(response.data.user));
          openCloseModalCreateUser();
        }).catch(error => {
          console.log(error);
        })
    }
  }

  const patchUser = async () => {
    selectedUser.numidentificacion = parseInt(selectedUser.numidentificacion);
    await axios.patch(baseUrl+`/${selectedUser.id}`, selectedUser)
      .then(response=> {
        var respuesta = response.data.updateUser; //respuesta de la API
        var dataAuxiliar = data; //Toda la data la ponemos en una variable

        let newDate =  moment.utc(respuesta.fechanacimiento).format('YYYY-MM-DD');
        
        dataAuxiliar.map(user => {
          if(user.id === respuesta.id){
            user.nombre = respuesta.nombre;
            user.fechanacimiento = newDate;
            user.numidentificacion = respuesta.numidentificacion;
          }
        })  
        openCloseModalEditUser();
      }).catch(error => {
        console.log(error);
      })
  }

  const deleteUser = async () => {
     await axios.delete(baseUrl+`/${selectedUser.id}`)
    .then(response=> {
      setData(data.filter(user => user.id !== selectedUser.id));
      openCloseModalDeleteUser();
    }).catch(error => {
      console.log(error);
    })
  }


  // Buttons Actions / handlers
  const buttonAction = (user, action) => {
     setSelectedUser(user);
     if(action === "Editar") openCloseModalEditUser();
     if(action === "Eliminar") openCloseModalDeleteUser();
  }

  useEffect(() => {
    getUserList();
  }, []);


  return (
    <div className="App">
    <br></br>
    
      <button onClick={() => openCloseModalCreateUser()} className="btn btn-success mb-3">Create user</button>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Birthdate</th>
            <th>Identification number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.fechanacimiento}</td>
              <td>{user.numidentificacion}</td>
              <td>
                <button className='btn btn-primary' onClick={() => buttonAction(user, 'Editar')}>Edit</button> {" "}
                <button className='btn btn-danger'onClick={() => buttonAction(user, 'Eliminar')}>Delete</button> {" "}  
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      {/* MODAL TO CREATE NEW USER */}
      <Modal isOpen={modalCreateUser}>
          <ModalHeader>Crear Usuario</ModalHeader>
          <ModalBody>
            <div className='form-group'>
              <label>Name: </label>
              <br/>
              <input name="nombre" type="text" className='form-control' onChange={handleChange}></input>
              <br/>
              <label>Birthdate: </label>
              <br/>
              <input name="fechanacimiento" type="date" className='form-control' onChange={handleChange}></input>
              <br/>
              <label>Identification number: </label>
              <br/>
              <input name="numidentificacion" type="number" className='form-control' onChange={handleChange}></input>
              <br/>
              <p className='text-danger'><b>{errorMessage}</b></p>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-primary' onClick={() => postUser()}>Insert</button>
            <button className='btn btn-danger' onClick={() => openCloseModalCreateUser()}>Cancel</button>
            
          </ModalFooter>
      </Modal>

        {/* MODAL TO EDIT USER */}
        <Modal isOpen={modalEditUser}>
          <ModalHeader>Editar Usuario</ModalHeader>
          <ModalBody>
            <div className='form-group'>
              <label>Name: </label>
              <br/>
              <input name="nombre" type="text" className='form-control' onChange={handleChange}></input>
              <br/>
              <label>Birthdate: </label>
              <br/>
              <input name="fechanacimiento" type="date" className='form-control' onChange={handleChange}></input>
              <br/>
              <label>Identification number: </label>
              <br/>
              <input name="numidentificacion" type="number" className='form-control' onChange={handleChange}></input>
              <br/>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-primary' onClick={() => patchUser()}>Edit</button>
            <button className='btn btn-danger' onClick={() => openCloseModalEditUser()}>Cancel</button>
          </ModalFooter>
      </Modal>

        {/* MODAL TO DELETE USER */}
        <Modal isOpen={modalDeleteUser}>
          <ModalBody>
            Are you sure to delete de user {selectedUser && selectedUser.nombre}?
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-primary' onClick={() => deleteUser()}>Yes</button>
            <button className='btn btn-danger' onClick={() => openCloseModalDeleteUser()}>No</button>
          </ModalFooter>
      </Modal>

    </div>

    
  );
} 

export default App;
