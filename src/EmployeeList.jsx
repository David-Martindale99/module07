import React from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'
import { useLocation, Link } from 'react-router-dom'
import EmployeeFilter from './EmployeeFilter.jsx'
import EmployeeAdd from './EmployeeAdd.jsx'

function EmployeeTable(props) {
    // Get the URL
    const { search } = useLocation()
    // Get the params from the URL
    const query = new URLSearchParams(search)
    // Get the 'employed' param specifically
    const q = query.get('employed')

    const employeeRows = props.employees
        .filter(employee => (q ? String(employee.currentlyEmployed) === q : true))
        .map(employee =>
        <EmployeeRow 
            key={employee._id}
            employee={employee}
            deleteEmployee = {props.deleteEmployee}
        />
    )
    return (
        <table className='bordered-table'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Ext</th>
                    <th>Email</th>
                    <th>Title</th>
                    <th>Date Hired</th>
                    <th>Currently Employed</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                {employeeRows}
            </tbody>
        </table>
    )
}


class EmployeeRow extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible: false
      };
      this.toggleModal = this.toggleModal.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
    }
  
    toggleModal() {
      this.setState(prevState => ({
        modalVisible: !prevState.modalVisible
      }));
    }
  
    handleDelete() {
      this.props.deleteEmployee(this.props.employee._id);
      this.toggleModal();
    }
  
    render() {
      const { employee } = this.props;
      return (
        <tr>
          <td>
            <Link to={`/edit/${employee._id}`}>{employee.name}</Link>
          </td>
          <td>{employee.extension}</td>
          <td>{employee.email}</td>
          <td>{employee.title}</td>
          <td>{employee.dateHired.toDateString().replace(/\s/g, '-')}</td>
          <td>{employee.currentlyEmployed ? 'Yes' : 'No'}</td>
          <td>
            <Button variant='danger' onClick={this.toggleModal}>X</Button>
            <Modal show={this.state.modalVisible} onHide={this.toggleModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete the selected employee?
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.toggleModal}>
                  Cancel
                </Button>
                <Button variant='danger' onClick={this.handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </td>
        </tr>
      );
    }
}

export default class EmployeeList extends React.Component {
    constructor() {
        super()
        this.state = { employees: [] }
        this.createEmployee = this.createEmployee.bind(this)
        this.deleteEmployee = this.deleteEmployee.bind(this)
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        fetch('/api/employees')
            .then(res => res.json())
            .then(data => {
                console.log('Total count of employees:', data.count)
                data.employees.forEach(employee => {
                    employee.dateHired = new Date(employee.dateHired)
                })
                this.setState({ employees: data.employees })
            })
            .catch(err => {console.log(err)})
    }
    createEmployee(employee) {
        fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee),
        })
        .then(res => res.json())
        .then(newEmployee => {
            newEmployee.employee.dateHired = new Date(newEmployee.employee.dateHired)
            const newEmployees = this.state.employees.concat(newEmployee.employee)
            this.setState({ employees: newEmployees })
            console.log('Total count of employees:', newEmployees.length)
        })
        .catch(err => {
            console.log(err)
        })
    }
    deleteEmployee(id) {
        fetch(`/api/employees/${id}`, { method: "DELETE" })
        .then(res => {
            if(!res.ok) {
                console.log('Failed to delete employee')
            } else {
                this.loadData()
            }
        })
    }
    render() {
        return (
            <React.Fragment>
                <h1><Badge bg='secondary'>Employee Managemanet Application</Badge></h1>
                <EmployeeFilter />
                <hr />
                <EmployeeTable employees={this.state.employees} deleteEmployee={this.deleteEmployee} />
                <hr />
                <EmployeeAdd createEmployee={this.createEmployee} />
            </React.Fragment>
        )
    }
}