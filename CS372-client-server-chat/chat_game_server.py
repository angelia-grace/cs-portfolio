from socket import *
from math import *

board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]


def pretty_board():
    formatted_board = f"""
    -------------
    | {board[0]} | {board[1]} | {board[2]} |
    -------------
    | {board[3]} | {board[4]} | {board[5]} |
    -------------
    | {board[6]} | {board[7]} | {board[8]} |
    -------------
    """
    # if not any((space != " ") for space in board):
    #    print("(Board is currently empty.)")
    return formatted_board


def clear_board():
    for space in range(len(board)):
        board[space] = " "

def win_check():

    for i in range(3):
        # check rows
        if board[0 + 3*i] == board[1 + 3*i] == board[2 + 3*i]:
            if board[0 + 3*i] != " ":
                return board[0 + 3*i]
        # check columns
        elif board[0 + i] == board[3 + i] == board[6 + i]:
            if board[0 + i] != " ":
                return board[0 + i]

    # check diagonals
    if board[0] == board[4] == board[8]:
        if board[0] != " ":
            return board[0]
    elif board[2] == board[4] == board[6]:
        if board[2] != " ":
            return board[2]

    if not any((space == " ") for space in board):
        return "no one (tie)"

    # if the game is ongoing, return none
    return None


port = 16358
sock = socket(AF_INET, SOCK_STREAM)                                          # make the socket
sock.bind(("localhost", port))                                              # set up the connection
sock.listen(1)
print("Server ready. Waiting for client...")

connection, addr = sock.accept()
playing = False
startup = True

while True:                                                                 # wait for packets

    message = connection.recv(4096)
    message = message.decode()
    if not startup:
        print(f"Message from client: {message}")

    if startup:
        intro_message = """Welcome to the server-client chat and games app!
You are now in chat mode.
To play a game, type 'play tictactoe'."""
        print("Client has connected! Waiting for next message...")
        startup = False
        connection.send(intro_message.encode())
        continue

    elif playing:

        # first validate message received
        if not message.isdigit():
            error_msg = "Invalid input. Enter an integer between 0 and 8."
            connection.send(error_msg.encode())
            continue
        elif 0 > int(message) or int(message) > 8:
            error_msg = "Invalid move. Enter an integer between 0 and 8."
            connection.send(error_msg.encode())
            continue
        elif board[int(message)] != " ":
            error_msg = "Invalid move. That space is not empty!"
            connection.send(error_msg.encode())
            continue
        else:
            board[int(message)] = "x"

        # check for win
        if win_check() is not None:
            board_and_win = f"""{pretty_board()}
The game is won by {win_check()}.
Client may initiate another game by replying 'play tictactoe'.
You are now in chat mode."""
            print(board_and_win)
            playing = False
            clear_board()
            connection.send(board_and_win.encode())
            continue

        # now get and validate my move
        print(pretty_board())
        print("Enter a move (integer between 0 and 8, representing a space on the board).")
        input_valid = False
        while not input_valid:
            this_move = input("Enter input > ")
            if not this_move.isdigit():
                print("Invalid input. Enter an integer between 0 and 8.")
            elif 0 > int(this_move) or int(this_move) > 8:
                print("Invalid move. Enter an integer between 0 and 8.")
            elif board[int(this_move)] != " ":
                print("Invalid move. That space is not empty!")
            else:
                input_valid = True
                board[int(this_move)] = "o"
        # check for win again
        if win_check() is None:
            board_and_instructions = f"""{pretty_board()}
Enter a move (integer between 0 and 8, representing a space on the board)."""
            connection.send(board_and_instructions.encode())
        else:
            board_and_win = f"""{pretty_board()}
The game is won by {win_check()}.
Client may initiate another game by replying 'play tictactoe'.
You are now in chat mode."""
            print(board_and_win)
            playing = False
            clear_board()
            connection.send(board_and_win.encode())
    elif message == "play tictactoe":
        playing = True
        ok_msg = """Ok! You are now playing as 'x'.
Enter a move (integer between 0 and 8, representing a space on the board)."""
        print("Client has started a game of tictactoe. You are now playing as 'o'.")
        connection.send(ok_msg.encode())
    elif message == "/q":
        quit_msg = "Client has closed the connection with command /q. Shutting down!"
        print(quit_msg)
        connection.send(quit_msg.encode())
        connection.close()
        exit()
    else:
        my_message = input("Enter input > ")
        if len(my_message.encode()) > 4096:
            print("Message too long to send. Try again.")
            continue
        elif len(my_message) == 0:
            print("Cannot send empty message!")
            continue
        elif my_message == "/q":
            quit_msg = "Server has closed the connection with command /q. Shutting down!"
            print(quit_msg)
            connection.send(quit_msg.encode())
            connection.close()
            exit()
        else:
            connection.send(my_message.encode())

    print("Waiting for reply from client...")
