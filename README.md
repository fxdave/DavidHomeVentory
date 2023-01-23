# DavidHomeVentory

An inventory management software for households.
The software has an android client and a very lightweight server that runs on x86_64 and probably on ARM.

Features:
 - Tag your boxes with a QR code (with the data: `davidhomeventory://THE_ID_OF_THE_BOX`)
 - You can read the QR with the camera app, that launches the client and you can edit the list there.
 - You can view the list of items
 - You can have boxes in boxes with each having items
 - You can reparent a box (e.g: you reparent a `shoe box` from the `gardrobe top` to the `gardrobe bottom`
 - You can edit everything in the list.
 - You can search by keywords and get the exact location of the box.


<a href="https://endsoftwarepatents.org/innovating-without-patents"><img style="height: 45px;" src="https://static.fsf.org/nosvn/esp/logos/patent-free.svg"></a>


## Installation:

For android app:
```
make install build-front build-front-apk
```

For server:
```
make install build-back run-prod
```

## Current state

I use it currently. It's feature complete, however, it's fresh. Expect bugs.
The code is not good, as I had so many obsticles to overcome. It will be better some day.

More about the refactor plans:
 - I will need a `yerpc` alternative tailored for web apps.
 - I will need a better DB. (I thought it would be fun to make it as lean as it could run on microcontrollers, but `sled` adds so much complexity)
 - I will find a way to use HTTPS instead of cleartext, but android doesn't make it easy.