/*
 * Copyright (c) MoonByte Corporation 2018, MoonByte Group 2018
 * 
 * MoonByte Group contains the following - 
 *  *Indie Goat
 *  *Vortex Studio
 *  *Shadow Goat Studio
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


//Initializing vars
var isConnected = false;
var websocket;

/*
 * The following functions are used to initialize connections
 */

function StartWebSocket(ServerIP, ServerPort)
{
    //Figure out if the browser supports WebSocket API
    if (window.WebSocket == undefined)
    {
        //WebSockets is not supported, logs it in the console.
        console.log("WebSockets is not supported!");
    }
    else
    {
        //WebSockets is supported, launches a new instance of WebSocket and add handlers functions on it
        console.log("WebSockets is supported!")
        OnLoad(ServerIP, ServerPort);
    }
}

function OnLoad(ServerIP, ServerPort)
{
    //Creates a instance of the server addess to connect to. ws for non secure websockets.
    //For future creations and updates to backend. We will update it to wss (ssl / https version of websockets)
    var wsUri = "ws://" + ServerIP + ":" + ServerPort;

    //Creates a new instance and connects to the generated uri
    websocket = new WebSocket(wsUri);

    //Adds all event handlers to the websocket
    websocket.onopen = function (evt) { OnOpen(evt) };
    websocket.onclose = function (evt) { OnClose(evt) };
    websocket.onmessage = function (evt) { OnMessage(evt) };
    websocket.onerror = function (evt) { OnError(evt) };
}

function OnOpen(evt)
{
    isConnected = truel
    console.log("Websocket is connected to the server!");
}

/*
 * The following functions are used to dispose of objects
 */

function OnClose(evt)
{
    //Log that the websocket is no-longer connected
    isConnected = false;
    console.log("WebSocket is currently not connected to the server!")
}

/*
 * The following functions are used for messaging
 */

function AddMessage(Command, Args)
{
    //Format the message for the websocket client
    var formatMessage = Command + "$%20" + Args.join('&%20');

    if (isConnected == true) {
        //Sends a message to the websocket
        websocket.send(formatMessage);
    } else {
        //Sends a message to the websocket when the websocket opens
        websocket.addEventListener('open', function (event) { websocket.send(formatMessage); });
    }
}

function OnMessage(evt)
{
    //Gets the server data and initialize a new FileReader
    serverMessage = evt.data;
    reader = new FileReader();

    //Attach a event to the reader for the load to end
    reader.addEventListener('loadend', (e) =>
    {
        //Processes the reader result and display it in the console
        console.log("Reader is done!");
        const text = e.srcElement.result;
        console.log(text);
    });

    //Log that the reader has started and start the reader.
    console.log("Reader has started!");
    reader.readAsText(serverMessage);
}

/*
 * The following messages are used for error handling
 */

function OnError(evt)
{

}