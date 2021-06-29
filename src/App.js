import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl = "http://localhost/apiFramework/";
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const abrirCerrarModalInsert = () => {
    setModalInsertar(!modalInsertar);
  }
  const [modalEditar, setModalEditar] = useState(false);
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }
  const [modalEliminar, setModalEliminar] = useState(false);
  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }
  const [frameworkSeleccionado, setFrameworkSeleccionado] = useState({
    id: '',
    nombre: '',
    lanzamiento: '',
    desarrollador: ''
  });
  const handleChange = e => {
    const {name, value} = e.target;
    setFrameworkSeleccionado((prevState) => ({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }
  const peticionGet = async() =>{
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error);
    });
  }
  const peticionPost = async() =>{
    let f = new FormData();
    f.append("nombre", frameworkSeleccionado.nombre);
    f.append("lanzamiento", frameworkSeleccionado.lanzamiento);
    f.append("desarrollador", frameworkSeleccionado.desarrollador);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response => {
      setData(data.concat(response.data));
      abrirCerrarModalInsert();
    }).catch(error => {
      console.log(error);
    });
  }
  const peticionPut = async() =>{
    let f = new FormData();
    f.append("nombre", frameworkSeleccionado.nombre);
    f.append("lanzamiento", frameworkSeleccionado.lanzamiento);
    f.append("desarrollador", frameworkSeleccionado.desarrollador);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response => {
      let dataNueva = data;
      dataNueva.map(framework => {
        if(framework.id === frameworkSeleccionado.id){
          framework.nombre = frameworkSeleccionado.nombre;
          framework.desarrollador = frameworkSeleccionado.desarrollador;
          framework.lanzamiento = frameworkSeleccionado.lanzamiento;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error => {
      console.log(error);
    });
  }
   const peticionDelete = async() =>{
    let f = new FormData();
   f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response => {
      setData(data.filter(framework => framework.id !== frameworkSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error => {
      console.log(error);
    });
  }
  const seleccionarFramework = (framework, caso) => {
    setFrameworkSeleccionado(framework);
    /*if(caso === 'Editar'){
      abrirCerrarModalEditar();
    }else{
      caso = null;
    }*/
    (caso === 'Editar') ? abrirCerrarModalEditar() : abrirCerrarModalEliminar()
  }
  useEffect(() =>{
    peticionGet();
  },[]);

  return (
    <div>
      <br />
      <button className="btn btn-success" onClick = {() => abrirCerrarModalInsert()}>Insertar</button>
      <br /> <br />

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>lanzamiento</th>
            <th>DEV</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
            {data.map(franework => (
            <tr key={franework.id}>
              <td>{franework.id}</td>
              <td>{franework.nombre}</td>
              <td>{franework.lanzamiento}</td>
              <td>{franework.desarrollador}</td>
              <td>
              <button className='btn btn-primary' onClick = {() => seleccionarFramework(franework, "Editar")}>Editar</button>{"   "}
              <button className='btn btn-danger' onClick = {() => seleccionarFramework(franework, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
            ))}
          </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Framework</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre: </label>
            <br />
            <input type='text' className='form-control' name="nombre" onChange = {handleChange}/>
            <br />
            <label>lanzamiento: </label>
            <br />
            <input type='text' className='form-control' name="lanzamiento" onChange = {handleChange}/>
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type='text' className='form-control' name="desarrollador" onChange = {handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick = {() => peticionPost()}>Insertar</button>{"   "}
          <button className="btn btn-danger" onClick = {() => abrirCerrarModalInsert()}>Cancelar</button>
        </ModalFooter>
      </Modal>

         <Modal isOpen={modalEditar}>
        <ModalHeader>Insertar Framework</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre: </label>
            <br />
            <input type='text' className='form-control' name="nombre" onChange = {handleChange} value={frameworkSeleccionado && frameworkSeleccionado.nombre}/>
            <br />
            <label>lanzamiento: </label>
            <br />
            <input type='text' className='form-control' name="lanzamiento" onChange = {handleChange} value={frameworkSeleccionado && frameworkSeleccionado.lanzamiento}/>
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type='text' className='form-control' name="desarrollador" onChange = {handleChange} value={frameworkSeleccionado && frameworkSeleccionado.desarrollador}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick = {() => peticionPut()}>Editar</button>{"   "}
          <button className="btn btn-danger" onClick = {() => abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Esta seguro que desea eliminar el framework {frameworkSeleccionado && frameworkSeleccionado.nombre}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>Si</button>
          <button className="btn btn-secondary" onClick = {() => abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
