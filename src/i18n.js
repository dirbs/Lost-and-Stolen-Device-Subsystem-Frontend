/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
 
i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          "welcomeApp": "Welcome to LSMS",
          "homeLink"  : "Home",
          "dashboardLink": "Dashboard",
          "newCaseLink": "New Case",
          "viewCaseLink": "View Case",
          "updateCaseLink": "Update Case",
          "searchCaseLink": "Search Cases",
          "allCasesLink"  : "All Cases",
          "pendingCaseLink": "Pending Cases",
          "blockedCaseLink": 'Blocked Cases',
          "recoveredCaseLink": 'Recovered Cases',
          "CaseStatusLink": "Case Status",
        }
      },
      es: {
        translations: {
          "welcomeApp": "Bienvenido a LSMS",
          "homeLink"  : "Casa",
          "dashboardLink": "Tablero",
          "newCaseLink"  : "Nuevo caso",
          "viewCaseLink": "Ver caso",
          "updateCaseLink": "Actualizar caso",
          "searchCaseLink"  : "Casos de búsqueda",
          "allCasesLink"  : "Todos los casos",
          "pendingCaseLink": "Casos pendientes",
          "blockedCaseLink": 'Casos bloqueados',
          "recoveredCaseLink": 'Casos recuperados',
          "CaseStatusLink": "Estado del caso",
        }
      },
      id: {
        translations: {
          "welcomeApp": "Selamat datang di LSMS",
          "homeLink"  : "Rumah",
          "dashboardLink": "Dasbor",
          "newCaseLink"  : "Kasus baru",
          "viewCaseLink": "Lihat Kasus",
          "updateCaseLink": "Perbarui Kasus",
          "searchCaseLink"  : "Kasus Pencarian",
          "allCasesLink"  : "Semua Kasus",
          "pendingCaseLink": "Kasus yang Tertunda",
          "blockedCaseLink": 'Kasus yang Diblokir',
          "recoveredCaseLink": 'Kasus yang Dipulihkan',
          "CaseStatusLink": "Status Kasus",
        }
      }
    },
    fallbackLng: 'en',
    debug: true,
 
    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',
 
    keySeparator: false, // we use content as keys
 
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },
 
    react: {
      wait: true
    }
  });
 
export default i18n;