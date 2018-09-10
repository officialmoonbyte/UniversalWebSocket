using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Fleck;
using IndieGoat.Net.Tcp;
using IndieGoat.UniversalServer.Interfaces;

namespace UniversalWebSocket
{
    public class UniversalWebSocket : IServerPlugin
    {

        #region Vars

        WebSocketServer websocketserver;
        int UniversalPort = 7777;

        #region Default Interface Vars

        public string Name
        {
            get { return "UniversalWebSocket"; }
        }

        public event EventHandler<SendMessageEventArgs> SendMessage;

        #endregion Default Interface Vars

        #endregion Vars

        #region OnLoad

        public void onLoad(string ServerDirectory)
        {
            int port = 7755;
            string pluginDirectory = ServerDirectory + @"\WebSocketServer";
            string PortFile = pluginDirectory + @"\Port.txt";
            string UniversalPortFile = pluginDirectory + @"\UniversalPort.txt";

            if (!Directory.Exists(pluginDirectory)) Directory.CreateDirectory(pluginDirectory);

            if (File.Exists(PortFile))
            {
                port = int.Parse(File.ReadAllText(PortFile));
            }
            else
            {
                File.Create(PortFile).Close(); File.WriteAllText(PortFile, port.ToString());
            }
            if (File.Exists(UniversalPortFile))
            {
                UniversalPort = int.Parse(File.ReadAllText(UniversalPortFile));
            }
            else
            {
                File.Create(UniversalPortFile).Close(); File.WriteAllText(UniversalPortFile, UniversalPort.ToString());
            }

            websocketserver = new WebSocketServer("ws://127.0.0.1:" + port);
            websocketserver.Start(socket =>
            {
                socket.OnOpen = () => Console.WriteLine("[WebSocketServer] Started WebSocket server on address ws://127.0.0.1:" + port);
                socket.OnClose = () => Console.WriteLine("[WebSocketServer] WebSocket server stopped. May be error");
                socket.OnMessage = message => OnMessageReceived(socket, message);
            });
        }

        #endregion OnLoad

        #region Invoke

        public void Invoke(ClientSocketWorkload workload, ClientContext context, int port, List<string> Args, string ServerDirectory)
        {
            workload.SendMessage(context, "Cannot process your request.");
        }

        #endregion Invoke

        #region Unload

        public void Unload()
        {
            websocketserver.Dispose();
        }

        #endregion Unload

        #region OnMessageReceived

        private void OnMessageReceived(IWebSocketConnection socket, string Message)
        {
            UniversalClient client = new UniversalClient();
            client.ConnectToRemoteServer(new UniversalConnectionObject("127.0.0.1", UniversalPort));

            //string Messsage will be split by $%20 for command and &%20 for args

            string command;

            string[] ad1 = Message.Split(new string[] { "$%20" }, StringSplitOptions.RemoveEmptyEntries);
            command = ad1[0];

            string[] ad2 = ad1[1].Split(new string[] { "&%20" }, StringSplitOptions.RemoveEmptyEntries);

            string response = client.ClientSender.SendCommand(command, ad2);
            socket.Send(Encoding.ASCII.GetBytes(response));
            client.Disconnect();
            client = null;
        }

        #endregion OnMessageReceived

    }
}
