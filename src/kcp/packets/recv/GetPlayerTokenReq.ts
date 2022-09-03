import { GetPlayerTokenReq,GetPlayerTokenRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";
import * as crypto from '../../../crypto'

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as GetPlayerTokenReq;

    const seed = 0x0n; //Generate a random seed

    const encrypted_client_seed = Buffer.from(body.clientSeed, 'base64'); //Get encrypted seed from client
    const decrypted_client_seed = crypto.rsaDecrypt(
      crypto.signingKey,
      encrypted_client_seed
    ); //Decrypt it with signingKey

    const seedBuf = Buffer.alloc(8);
    seedBuf.writeBigUInt64BE(seed ^ decrypted_client_seed.readBigUInt64BE()); //xor seed with client seed

    const encryptedSeed = crypto
      .rsaEncrypt(crypto.publicKey_OS, seedBuf)
      .toString('base64'); //encrypt again with public key
    const seedSignature = crypto
      .rsaSign(crypto.signingKey, seedBuf)
      .toString('base64'); // sign with signing key

    session.connection.encryptor.seed(seed);

    const dataObj: GetPlayerTokenRsp = GetPlayerTokenRsp.fromPartial({
        retcode: 0,
        uid: 1,
        token: body.accountToken,
        accountType: body.accountType,
        accountUid: body.accountUid,
        channelId: body.channelId,
        encryptedSeed: encryptedSeed,
        seedSignature: seedSignature
    })

    session.send(GetPlayerTokenRsp, dataObj);
}