// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract certs is ERC721URIStorage, Ownable {
    
    //Direccion del contrato NFT del proyecto
    address public cert;
    //contador certs
    uint256 public contador;
    //estructura 
    struct Certificado {
        string universidad;
        string alumno;
        address dirAlumno;
        uint8 notaMedia;
    }

    Certificado [] public certificados;
    //constructor
    constructor() ERC721("Certificado","crt") {
        cert = msg.sender;
    }

    mapping(address => string) public universidades; 

    function registrarUniversidad(string memory _nombre,address _addrUni) public onlyOwner {
        universidades[_addrUni] = _nombre ;
    }

    modifier isUniversidad () {
        string memory nombre = universidades[msg.sender];
        require(bytes(nombre).length> 0,"Universid no registrada");
        _;
    }
    //create NFT Token
    function _createCertNFT(string memory _alumno,address _dirAlumno,uint8 _nota,string memory _tokenUri) public isUniversidad {
        string memory nombreUni = universidades[msg.sender];
        Certificado memory newCert = Certificado(nombreUni,_alumno,_dirAlumno,_nota);
        certificados.push(newCert);
        _safeMint(_dirAlumno,contador);
        _setTokenURI(contador,_tokenUri);
        contador++;
    }
}