API ApiClient (JavaScript)
=======================

Installation
------------

```bash
npm i git+https://<deploy_token_name>:<deploy_token>@gitlab.agrora.market/Agrora/api-client-js
```

Usage
-----

```javascript
import ApiClient from '@agrora/api-client';


async function main()
{
    const client = new ApiClient();
    
    //Authenticate
    await client.authenticateUser({
        username: 'test@agrora.market',
        password: 'test'
    });
    
    const user = await client.getCurrentUser();
    console.log(user.emailAddress);
    
    //Iterate a list of marketplace advertisements
    for (const adv of client.getAdvertisements()) {
        console.log(adv.transportLocation.label);
        console.log(adv.price.fixed);
    }
}

main();
```

Naming Conventions
------------------

```text
[C]reate    = POST   = createXyz()/ with XyzCreation/XyzUpdate
[R]etrieval = GET    = getXyz(id)
[U]pdate    = PUT    = updateXyz(id) with XyzUpdate
[D]elete    = DELETE = removeXyz(id) [with XyzRemoval]

getXyz(Create|Update)Form()
submitXyz(Create|Update)Form()
```