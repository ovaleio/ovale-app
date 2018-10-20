# Onboarding

Onboarding is a multistep process for onboarding the app and the ovale ecosystem.

## Process

All the process should be in redux actions / api
Only the logic of showing the right component should be placed in onboarding.js

* User enters email
* if email is not found
    * ask for a name
    * ask for a two step password
    * we send a validation email
    * validation is true
    * jmp authenticate
* if email found
    * stp authenticate
    * ask for a password
    * put jwt on electron-settings
    * jmp api keys
* api keys empty  `Show settings ? remake Settings?`
    * selectbox onchange
        * display apikey/apisecret for exchange


## STATE

* [x] set global state in step by step onboarding
* Make a component for user don't exists
* EMail Verification : don't delete records in Verification table, make it updateable instead (createdAt/updatedAt)