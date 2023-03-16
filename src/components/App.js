import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './Home';
import Cert from './Cert';

class App extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <div>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/certs" element={<Cert />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        );
    }

}

export default App;