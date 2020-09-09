/*!
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Use untyped import syntax for Node built-ins
import { Agent } from 'http';
import {
  ServiceAccountCredential, RefreshTokenCredential, getApplicationDefault 
} from './credential-internal';
import { Credential } from './credential-interfaces';

let globalAppDefaultCred: Credential;
const globalCertCreds: { [key: string]: ServiceAccountCredential } = {};
const globalRefreshTokenCreds: { [key: string]: RefreshTokenCredential } = {};

/**
 * Returns a credential created from the
 * {@link
 *    https://developers.google.com/identity/protocols/application-default-credentials
 *    Google Application Default Credentials}
 * that grants admin access to Firebase services. This credential can be used
 * in the call to
 * {@link
 *   https://firebase.google.com/docs/reference/admin/node/admin#.initializeApp
 *  `admin.initializeApp()`}.
 *
 * Google Application Default Credentials are available on any Google
 * infrastructure, such as Google App Engine and Google Compute Engine.
 *
 * See
 * {@link
 *   https://firebase.google.com/docs/admin/setup#initialize_the_sdk
 *   Initialize the SDK}
 * for more details.
 *
 * @example
 * ```javascript
 * admin.initializeApp({
 *   credential: admin.credential.applicationDefault(),
 *   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
 * });
 * ```
 *
 * @param {!Object=} httpAgent Optional [HTTP Agent](https://nodejs.org/api/http.html#http_class_http_agent)
 *   to be used when retrieving access tokens from Google token servers.
 *
 * @return {!admin.credential.Credential} A credential authenticated via Google
 *   Application Default Credentials that can be used to initialize an app.
 */
export function applicationDefault(httpAgent?: Agent): Credential {
  if (typeof globalAppDefaultCred === 'undefined') {
    globalAppDefaultCred = getApplicationDefault(httpAgent);
  }
  return globalAppDefaultCred;
}

/**
 * Returns a credential created from the provided service account that grants
 * admin access to Firebase services. This credential can be used in the call
 * to
 * {@link
 *   https://firebase.google.com/docs/reference/admin/node/admin#.initializeApp
 *   `admin.initializeApp()`}.
 *
 * See
 * {@link
 *   https://firebase.google.com/docs/admin/setup#initialize_the_sdk
 *   Initialize the SDK}
 * for more details.
 *
 * @example
 * ```javascript
 * // Providing a path to a service account key JSON file
 * var serviceAccount = require("path/to/serviceAccountKey.json");
 * admin.initializeApp({
 *   credential: admin.credential.cert(serviceAccount),
 *   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
 * });
 * ```
 *
 * @example
 * ```javascript
 * // Providing a service account object inline
 * admin.initializeApp({
 *   credential: admin.credential.cert({
 *     projectId: "<PROJECT_ID>",
 *     clientEmail: "foo@<PROJECT_ID>.iam.gserviceaccount.com",
 *     privateKey: "-----BEGIN PRIVATE KEY-----<KEY>-----END PRIVATE KEY-----\n"
 *   }),
 *   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
 * });
 * ```
 *
 * @param serviceAccountPathOrObject The path to a service
 *   account key JSON file or an object representing a service account key.
 * @param httpAgent Optional [HTTP Agent](https://nodejs.org/api/http.html#http_class_http_agent)
 *   to be used when retrieving access tokens from Google token servers.
 *
 * @return A credential authenticated via the
 *   provided service account that can be used to initialize an app.
 */
export function cert(serviceAccountPathOrObject: string | object, httpAgent?: Agent): Credential {
  const stringifiedServiceAccount = JSON.stringify(serviceAccountPathOrObject);
  if (!(stringifiedServiceAccount in globalCertCreds)) {
    globalCertCreds[stringifiedServiceAccount] = new ServiceAccountCredential(serviceAccountPathOrObject, httpAgent);
  }
  return globalCertCreds[stringifiedServiceAccount];
}

/**
 * Returns a credential created from the provided refresh token that grants
 * admin access to Firebase services. This credential can be used in the call
 * to
 * {@link
 *   https://firebase.google.com/docs/reference/admin/node/admin#.initializeApp
 *   `admin.initializeApp()`}.
 *
 * See
 * {@link
 *   https://firebase.google.com/docs/admin/setup#initialize_the_sdk
 *   Initialize the SDK}
 * for more details.
 *
 * @example
 * ```javascript
 * // Providing a path to a refresh token JSON file
 * var refreshToken = require("path/to/refreshToken.json");
 * admin.initializeApp({
 *   credential: admin.credential.refreshToken(refreshToken),
 *   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
 * });
 * ```
 *
 * @param refreshTokenPathOrObject The path to a Google
 *   OAuth2 refresh token JSON file or an object representing a Google OAuth2
 *   refresh token.
 * @param httpAgent Optional [HTTP Agent](https://nodejs.org/api/http.html#http_class_http_agent)
 *   to be used when retrieving access tokens from Google token servers.
 *
 * @return A credential authenticated via the
 *   provided service account that can be used to initialize an app.
 */
export function refreshToken(refreshTokenPathOrObject: string | object, httpAgent?: Agent): Credential {
  const stringifiedRefreshToken = JSON.stringify(refreshTokenPathOrObject);
  if (!(stringifiedRefreshToken in globalRefreshTokenCreds)) {
    globalRefreshTokenCreds[stringifiedRefreshToken] = new RefreshTokenCredential(
      refreshTokenPathOrObject, httpAgent);
  }
  return globalRefreshTokenCreds[stringifiedRefreshToken];
}
