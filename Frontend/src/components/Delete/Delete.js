import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';

class Delete extends Component{

    constructor(props){
        super(props);

        this.state = {
            deleteBookID : ''
        }

        this.submitDelete = this.submitDelete.bind(this);
        this.handleBookIdchange = this.handleBookIdchange.bind(this);
    }

    handleBookIdchange(e){
        this.setState({
            deleteBookID : e.target.value
        })
    }

    submitDelete(e){
        e.preventDefault();

        const data = {
            deleteBookID: this.state.deleteBookID,
        }

        axios.post('http://3.137.147.188:3001/delete', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.location.href = '/home';
                } else {
                    alert("Falied to delete a Book");
                }
            }).catch(
                function (error) {
                    console.log("Failed To Delete a Book");
                    console.log(error);
                    alert("Book Id Doesn't Exist");
                }
            );
    }

    render(){
        //if not logged in go to login page
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
        return(
            <div class="container">
                {redirectVar}
                <form>
                    <div style={{width: "50%",float: "left"}} class="form-group">
                        <input onChange={this.handleBookIdchange} type="text" class="form-control" name="BookID" placeholder="Search a Book by Book ID" required/>
                    </div>
                    <div style={{width: "50%", float: "right"}}>
                            <button class="btn btn-success" type="submit" onClick={this.submitDelete}>Delete</button>
                    </div> 
                </form>
            </div>
        )
    }
}

export default Delete;