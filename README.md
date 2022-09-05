# MoonlightTS
 Server software reimplementation for certain anime game

## Technologies used

- [Express](https://expressjs.com/) - Http(s) Server
- [protobuf-ts](https://www.npmjs.com/package/protobufjs) - Used for serializing/deserializing data sent from the Client to the Server and vice versa.
- [kcp-ts](https://github.com/timing1337/kcp-ts) - A Fast and Reliable ARQ Protocol (Supports 0ms ping)

## Usage

1.Clone the Github Repository

```powershell
git clone https://github.com/MoonlightPS/MoonlightTS.git
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