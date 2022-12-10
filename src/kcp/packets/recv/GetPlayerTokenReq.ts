import { GetPlayerTokenReq, GetPlayerTokenRsp } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import * as crypto from '../../../crypto';
import Account from '../../../db/Account';

export default async function handle(session: Session, packet: DataPacket) {

  const body = ProtoFactory.getBody(packet) as GetPlayerTokenReq;
  session.c.debug(GetPlayerTokenReq.toJSON(body))

  const account = await Account.fromToken(body.accountToken);

  const seed = 0x0n; //create a random seed

  const encrypted_client_seed = Buffer.from(body.clientRandKey, 'base64'); //Get encrypted seed from client
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

  const dataObj: GetPlayerTokenRsp = GetPlayerTokenRsp.fromPartial({
    retcode: 0,
    uid: account?.uid,
    token: account?.token,
    Unk3250DILMOPPLPEM: body.Unk3250DILMOPPLPEM,
    accountUid: body.accountUid,
    channelId: body.channelId,
    Unk3250BBOCPCOJNKF: encryptedSeed,
    Unk3250HBNIIDFKHGN: seedSignature,
  });

  session.send(GetPlayerTokenRsp, dataObj);

  session.uid = account!.uid

  session.connection.encryptor.seed(seed);
}