import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state ={
            bookID : '',
            title : '',
            author : ''
        }
        this.submitCreate = this.submitCreate.bind(this);
        this.bookIdChangeHandler = this.bookIdChangeHandler.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.authorNameChangeHandler = this.authorNameChangeHandler.bind(this);
    }

    bookIdChangeHandler(e){
        this.setState({
            bookID : e.target.value
        });
    }

    titleChangeHandler(e){
        this.setState({
            title : e.target.value
        });
    }

    authorNameChangeHandler(e){
        this.setState({
            author : e.target.value
        });
    }

    submitCreate(e) {
        e.preventDefault();

        const data = {
            bookID: this.state.bookID,
            title: this.state.title,
            author: this.state.author
        }

        axios.post('http://3.137.147.188:3001/create', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.location.href = '/home';
                } else {
                    alert("Falied to add a Book");
                }
            }).catch(
                function (error) {
                    console.log("Failed To add a Book");
                    console.log(error);
                    alert("Book Id already Exists");
                }
            );
    }

    render() {
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }

        return (
            <div>
                {redirectVar}
                <br />
                <div class="container">
                    <form action="http://127.0.0.1:3000/create" method="post">
                        <div style={{ width: '30%' }} class="form-group">
                            <input onChange={this.bookIdChangeHandler} type="text" class="form-control" name="BookID" placeholder="Book ID" required />
                        </div>
                        <br />
                        <div style={{ width: '30%' }} class="form-group">
                            <input type="text" onChange={this.titleChangeHandler} class="form-control" name="Title" placeholder="Book Title" required />
                        </div>
                        <br />
                        <div style={{ width: '30%' }} class="form-group">
                            <input type="text" onChange={this.authorNameChangeHandler} class="form-control" name="Author" placeholder="Book Author" required />
                        </div>
                        <br />
                        <div style={{ width: '30%' }}>
                            <button class="btn btn-success" type="submit" onClick={this.submitCreate}>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Create;