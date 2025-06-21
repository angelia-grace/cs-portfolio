from socket import *

sock = socket(AF_INET, SOCK_STREAM)                             # make the socket
sock.connect(("localhost", 16358))                         # set up the connection

board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]  # placeholder
print("Press any key + ENTER to connect to server. ")

while True:                                                                 # wait for packets

    # get input and send
    this_message = input("Enter input > ")
    if len(this_message.encode()) > 4096:
        print("Message too long to send. Try again.")
        continue
    elif len(this_message) == 0:
        print("Cannot send empty message!")
        continue
    sock.send(this_message.encode())

    # print board locally with my move

    print("Waiting for reply from server...")
    # get message from server and print it all
    message = sock.recv(4096).decode()
    print("Reply from server:")
    print(message)

