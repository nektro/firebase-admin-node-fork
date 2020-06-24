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

// import * as firebase from 'firebase-admin';
import { initializeApp, cert } from '../../../../lib/';
// import * as admin from '../../../../lib/';
// import { initializeApp, App, cert } from '../../../../lib';
import { FirebaseApp } from '../../../../lib/firebase-app';
// TODO: If you use FirebaseApp, it doesn't work...

export function initApp(serviceAcct: any, name: string): FirebaseApp {
  return initializeApp({
    credential: cert(serviceAcct),
    databaseURL: 'https://mock.firebaseio.com'
  }, name);
}

export default initApp;
