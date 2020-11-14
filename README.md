# CS522 - HW3
A simple mobile text entry interface that uses the device’s directional motion to allow users to undo and redo.

## Instructions on how to run the code  
* Install Node.js and npm
* Uncompress the zip file
* Open terminal
    * Go in to the uncompressed directory: `cd` pathToDirectory
    * `npm install`
    * `npm start`
* After starting it opens [http://localhost:3000](http://localhost:3000)
* To run it on your mobile phone to use the motion
    * On Mac: Open System Prefrences, Go to Network, find your IP address in your local network and open that with port 3000 on your mobile browser. ex: [http://10.0.0.33:3000](http://10.0.0.33:3000)
    * You can find this IP also by running `ifconfig` in terminal 

## Instructions on how to use the interface  
* Type something in the text area 
* Move the device quickly in z direction: Undo
* Move the device quickly in x direction: Redo
* You can use the undo/redo buttons to do the same actions
* If there is nothing to Undo/Redo the buttons will be disabled, and motions don't do anything

## system requirements
* The device you are testing should have an accelerometer.
* Currently this interface only supports Android devices.

## Demo
To try the interface without running the code, open this link on your mobile phone: [netlify](https://netlifylink.com/).