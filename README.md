# CS522 - HW3
A simple mobile text entry interface that uses the device’s directional motion to allow users to undo and redo.

## Demo
To try the interface without running the code, open this link on your mobile phone: https://pantea-cs522-hw3.netlify.app/

## Instructions on how to run the code  
* Install Node.js and npm
* Uncompress the zip file
* Open terminal
    * Go in to the uncompressed directory: `cd` pathToDirectory
    * `npm install`
    * `npm start`
* After starting, a webpage will be opened [http://localhost:3000](http://localhost:3000)
* To run it on your mobile phone to use the motions to ineterct
    * Open System Prefrences on Mac, select Network, find your IP address in your local network and open that with port 3000 on your mobile browser (ex: http://10.0.0.33:3000)
    * You can find this IP also by running `ifconfig` in terminal 

## Instructions on how to use the interface  
* Type something in the text area 
* Move the device quickly in z direction: Undo
* Move the device quickly in y direction: Redo
* You can use the undo/redo buttons to do the same actions
* If there is nothing to Undo/Redo the buttons will be disabled, and motions don't do anything

## System requirements
* The device you are testing should have an accelerometer.
* Currently this interface only supports Android devices.

## Libraries and resources
* [react-use](https://github.com/streamich/react-use)
* [react](https://github.com/facebook/react)
* [vnglst] https://github.com/vnglst/write-only
