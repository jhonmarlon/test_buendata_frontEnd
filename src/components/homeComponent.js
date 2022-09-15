import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

const HomeComponent = () => {
window.scrollTo(0, 0);

    
  const [data,setData] = useState();

  // Patitions
  const getUsers = async() => {
    await axios.get('http://localhost:5000/api/users')
      .then(response => {
        setData(response.data);
        console.log(data)
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    getUsers();
  }, []);

    return (
     <div>
        <h1>Home</h1>
     </div>
    );
};

export default HomeComponent;