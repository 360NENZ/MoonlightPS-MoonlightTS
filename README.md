# MoonlightTS
 Server software reimplementation for certain anime game

## Technologies used

- [Express](https://expressjs.com/) - Http(s) Server
- [protobuf-ts](https://github.com/timostamm/protobuf-ts) - Used for serializing/deserializing data sent from the Client to the Server and vice versa.
- [kcp-ts](https://github.com/boba-ps/kcp-ts) - A Fast and Reliable ARQ Protocol

## Usage

1.Clone the Github Repository

```powershell
git clone https://github.com/tamilpp25/MoonlightTS.git
git checkout boba-fork
```

2.Extract and open the repository in the Terminal

```powershell
# Assuming that you are in Windows
cd MoonlightTS
```

3.Put Resources in the following folder: 
 
```js
src/data/resource/
```

4.Run the following

```powershell
npm install
```

```powershell
npm start
```