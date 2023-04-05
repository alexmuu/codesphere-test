import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Dropdown, Button, Container } from "react-bootstrap";
import {BiTrash} from "react-icons/bi"
import {BsPlus, BsThreeDotsVertical} from "react-icons/bs"

function WorkspaceList() {

  //Creating state for API Data as well as the workspace number for automated counting
  const [data, setData] = useState([]);
  const [workspaceNumber, setWorkspaceNumer] = useState(1);

  // handling the listWorkspaces API Call
  const listWorkspaces = () => {
    axios.post("https://39314-3000.2.codesphere.com/listWorkspaces", {
        teamId: "1999"
    })
    .then((response) => {
        setData(response.data)
    })
    .catch((error) => {
        console.log("error",error)
    })
  }

  // Handling the createWorkspace API Call
  const createWorkspace = () => {
    axios.post("https://39314-3000.2.codesphere.com/createWorkspace", {
        teamId: "1999",
        name: "Workspace " + workspaceNumber
    })
    .then((response) => {
        console.log("Workspace created")
        listWorkspaces();
        setWorkspaceNumer(workspaceNumber + 1);
        localStorage.setItem("workspaceNumber", workspaceNumber + 1);
    })
    .catch((error) => {
        console.log("another errror", error)
    })
  }

  // Handling the deleteWorkspace API Call
  const deleteWorkspace = (id) => {
    axios.post("https://39314-3000.2.codesphere.com/deleteWorkspace", {
        teamId: "1999",
        workspaceId: id
    })
    .then((response) => {
        console.log("workspace deleted");
        listWorkspaces();
    })
    .catch((error) => {
        console.log(error)
    })
  }

  // Function to reset Workspace Number -> I initially had a button to reset it for testing, this is commented out in the html part
  const resetWorkspaceNumber = () => {
    setWorkspaceNumer(1);
  }

  useEffect(() => {

    // Saving current workspace number locally so that it doesn't change on page reload
    const currentWorkspaceNumber = localStorage.getItem("workspaceNumber");
    if (currentWorkspaceNumber) {
        setWorkspaceNumer(parseInt(currentWorkspaceNumber));
    }
    listWorkspaces();

    // Establishing a Websocket Connection and logging changes to the workspaces in the console -> Syntax from mdn
    const websocket = new WebSocket('wss://39314-3000.2.codesphere.com/1999');

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(`Workspace with ID ${message.id} was modified`);
    }

  },[]);

  

  return (
    <Container className='w-80'>
      <Container className="button-container d-flex justify-content-end px-0">
        <Button onClick={createWorkspace} variant="purple" className="btn d-flex align-items-center text-light my-4">
            <BsPlus size="2em" />New workspace</Button>
        {/* <button onClick={resetWorkspaceNumber} className="btn btn-link">Reset Workspace Number</button> */}
      </Container>
      <Table className="workspacetable table table-transparent text-light">
        <thead className="tablehead">
          <tr>
            {/* <th>ID</th>*/}
            <th className="tableheading-small align-middle py-1">Name</th>
            <th className="tableheading-small align-middle text-end py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((workspace) => (
            <tr key={workspace.id} id={workspace.id}>
              {/* <td>{workspace.id}</td> */}
              <td className="align-middle">{workspace.name}</td>
              <td className="align-middle text-end">
                <Dropdown>
                    <Dropdown.Toggle variant="purple-hover" className="deleteDropdown" id="dropdown-basic">
                        <BsThreeDotsVertical className="align-middle" size="1.5em" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end" className="dropdown-menu">
                        <Dropdown.Item onClick={() => deleteWorkspace(workspace.id)} className="dropdown-delete d-flex align-items-center text-light">
                            <BiTrash className="dropdown-icon" size="1em" />
                            <span className="dropdown-text pl-2">Delete</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default WorkspaceList;
