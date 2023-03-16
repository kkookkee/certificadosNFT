import React, { Component } from 'react';
import smart_contract from '../abis/certs.json';
import Web3 from 'web3';
import logo from '../logo.png';

import Navigation from './Navbar';

class Cert extends Component {

  async componentDidMount() {
    // 1. Carga de Web3
    await this.loadWeb3()
    // 2. Carga de datos de la Blockchain
    await this.loadBlockchainData()
  }

  // 1. Carga de Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts: ', accounts)
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('¡Deberías considerar usar Metamask!')
    }
  }

  // 2. Carga de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId() 
    console.log('networkid:', networkId)
    const networkData = smart_contract.networks[networkId]
    console.log('NetworkData:', networkData)

    if (networkData) {
      const abi = smart_contract.abi
      console.log('abi', abi)
      const address = networkData.address
      console.log('address:', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
    } else {
      window.alert('¡El Smart Contract no se ha desplegado en la red!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loading: true
    }
  }
  _emitCert = async(_alumno,_dirAlumno,_nota,_tokenUri) => {
    try {
      console.log(`Executing _emitCert, _alumno: ${_alumno} _dirAlumno: ${_dirAlumno} _nota: ${_nota} _tokenUri: ${_tokenUri}`)
      await this.state.contract.methods._createCertNFT(_alumno,_dirAlumno,_nota,_tokenUri).send({
        from:this.state.account
      })
    } catch (error) {
      this.setState({errorMessage:error})
    } finally {
      this.setState({loading: false})
    }
  }
  render() {
    return (
      <div>
        <Navigation account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
               <h2> Emision de certificados </h2>
               <form onSubmit={(e)=>{
                  e.preventDefault()
                  this._emitCert(this._alumno.value,this._dirAlumno.value,this._nota.value,this._tokenUri.value)
                }}>
                <input type='text' className='form-control mb-1' ref={(input)=>this._alumno = input} placeholder='Nombre alumno'></input>
                <input type='text' className='form-control mb-1' ref={(input)=>this._dirAlumno = input} placeholder='Direccion alumno'></input>
                <input type='number' className='form-control mb-1' ref={(input)=>this._nota = input} placeholder='Nota certificado'></input>
                <input type='text' className='form-control mb-1' ref={(input)=>this._tokenUri = input} placeholder='Token uri certificado'></input>
                <input type='submit' className='btn btn-block btn-success btn-sm' value='Emitir certificado'></input>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Cert;
