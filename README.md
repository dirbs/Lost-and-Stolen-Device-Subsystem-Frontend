SPDX-License-Identifier: BSD-3-Clause-Clear

Copyright (c) 2018-2019 Qualcomm Technologies, Inc.

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## LSDS Front-end

### Documentation
[LSDS-API-Installation-Guide-1.0.0](https://github.com/dirbs/Documentation/blob/master/Lost-and-Stolen-Device-Subsystem/LSDS-API-Installation-Guide-1.0.0.pdf)<br />
[LSDS-SPA-Installation-Guide-1.0.0.pdf](https://github.com/dirbs/Documentation/blob/master/Lost-and-Stolen-Device-Subsystem/LSDS-SPA-Installation-Guide-1.0.0.pdf) <br />
[LSDS-User-Guide-1.0.0.pdf](https://github.com/dirbs/Documentation/blob/master/Lost-and-Stolen-Device-Subsystem/LSDS-User-Guide-1.0.0.pdf)<br />

### Backtend Application Repo
https://github.com/dirbs/Lost-and-Stolen-Device-Subsystem

### Prerequisites
```
- Node v8.9.4 or greater
- NPM v5.6.X or greater
- Nginx 1.14.X
```

### Supported Browsers
```
Chrome 63.0 (Recommended)
Internet Explorer 11.0
Firefox 52.5 ESR, 57.0
Safari 11.0
Edge 41.16299
```

### Setup

#### To Install this code on your local system
```
cd /path/to/install/location
git clone https://github.com/dirbs/Lost-and-Stolen-Device-Subsystem-Frontend.git
```

#### Install dependencies
```
npm install
```

#### APIMan, Keycloak and API Configurations

```
cp src/settings-template.json src/settings.json
```

**Note:** Update all the configs into the file.

#### Serve with hot reload (watch changes instantly) at localhost:3000
```
npm start
```

#### Build for production with minification
```
npm run build
```
