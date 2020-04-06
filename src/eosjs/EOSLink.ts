import { ApolloLink, Observable } from 'apollo-link';
import cookie from 'js-cookie';
import { Api, JsonRpc } from 'eosjs';
import encoding from 'text-encoding';
import jwt from 'jsonwebtoken';

import { KARMA_AUTHOR, EOS_URL, REQUEST_JWT, RESPONSE_JWT, PUB_KEY } from '../common/config';
import karmaApi from '../services/api';

import actionMap from './actionMap';
import JsSignatureProvider from './JsProvider';

export const rpc = new JsonRpc(EOS_URL, { fetch });
export const signatureProvider = new JsSignatureProvider();

const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new encoding.TextDecoder(),
  textEncoder: new encoding.TextEncoder(),
});

export const set = (obj: any, path: any, value: any): any => {
  let schema = obj; // a moving reference to internal objects within obj
  const pList = path.split('.');
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;
  return obj;
};

const tx = async (name: string, data: any, path: string, contract = 'thekarmadapp') => {
  const accountName = cookie.get(KARMA_AUTHOR);
  const theObj = path ? set(data, path, accountName) : data;

  try {
    const blocksBehind = 3;
    const info = await api.rpc.get_info();
    const refBlock = await api.rpc.get_block(info.head_block_num - blocksBehind);

    const availableKeys = await api.signatureProvider.getAvailableKeys();

    const body = {
      action: name,
      contract: contract,
      account_name: accountName,
      data: JSON.stringify(theObj),
      domain_id: 1,
      ref_block_prefix: refBlock.id,
      ref_block_num: refBlock.block_num,
      expiration: refBlock.timestamp,
      pub_key: availableKeys[0],
    };

    const encodedBody = {
      data: jwt.sign(body, REQUEST_JWT),
    };

    const response = await karmaApi.post('/profile/dappplz', encodedBody);
    const decodedResponse = jwt.decode(response.data, RESPONSE_JWT);
    const { SignedTx, SerializedTx } = decodedResponse.response;

    const allSigs = [SignedTx];
    const serializedTransaction = Buffer.from(SerializedTx, 'hex');
    const transaction = {
      actions: [
        {
          account: contract,
          name: name,
          authorization: [
            {
              actor: contract,
              permission: 'active',
            },
            {
              actor: accountName,
              permission: 'active',
            },
          ],
          data: theObj,
        },
      ],
    };

    const abis = await api.getTransactionAbis(transaction);
    availableKeys.unshift(PUB_KEY);

    const requiredKeys = await api.authorityProvider.getRequiredKeys({ transaction, availableKeys });
    const args = {
      chainId: info.chain_id,
      requiredKeys,
      serializedTransaction,
      abis,
    };

    const sigs = await api.signatureProvider.sign(args);
    allSigs.push(sigs[0]);

    const result = await api.pushSignedTransaction({
      signatures: allSigs,
      serializedTransaction: serializedTransaction,
    });

    return result;
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
  }
};

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default () => {
  return new ApolloLink((operation, forward) => {
    return new Observable(async observer => {
      const { action, txToId, idToContent, typeName } = actionMap[operation.operationName];

      let txAction;
      if (action.dataPath) {
        txAction = {
          [action.dataPath]: operation.variables,
        };
      } else {
        txAction = operation.variables;
      }

      try {
        const response = await tx(action.name, txAction, action.senderPath, action.contract);
        if (!txToId && !idToContent) {
          const data = {
            [operation.operationName]: {
              __typename: typeName,
              success: true,
            },
          };
          operation.setContext({ response });
          observer.next({ data });
          observer.complete();
          return;
        } else if (!txToId && idToContent) {
          const accountName = cookie.get(KARMA_AUTHOR);

          await timeout(2000);
          const content = await idToContent(accountName);
          const data = {
            [operation.operationName]: {
              __typename: typeName,
              ...content,
            },
          };
          operation.setContext({ response });
          observer.next({ data });
          observer.complete();
        } else {
          const id = await txToId(response);
          await timeout(5000);
          let content;
          try {
            content = await idToContent(id);
          } catch (e) {
            return;
          }
          const data = {
            [operation.operationName]: {
              __typename: typeName,
              ...content,
            },
          };
          operation.setContext({ response });
          observer.next({ data });
          observer.complete();
        }
      } catch (e) {}
    });
    return forward(operation);
  });
};
