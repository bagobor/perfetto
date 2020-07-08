// Copyright (C) 2020 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Engine} from '../common/engine';

import {Controller} from './controller';
import {globals} from './globals';

export interface TraceErrorControllerArgs {
  engine: Engine;
}

export class TraceErrorController extends Controller<'main'> {
  private hasRun = false;
  constructor(private args: TraceErrorControllerArgs) {
    super('main');
  }

  run() {
    if (this.hasRun) {
      return;
    }
    this.hasRun = true;
    this.args.engine
        .query(`SELECT name FROM stats WHERE severity = 'error' and value > 0`)
        .then(result => {
          globals.publish('TraceErrors', result.columns[0].stringValues!);
        });
  }
}