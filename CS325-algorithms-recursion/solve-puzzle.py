# AUTHOR: ANGELIA-GRACE MARTIN
# DATE: 6/2/2023
# ASSIGNMENT: CS 325 Assignment 8 - Graph Algorithms II

import copy

def solve_puzzle(Board, Source, Destination):
    """
    Finds the shortest path from the source to the destination over a given puzzle board.
    """
    # initialize memo full of 0s (not visited) to track progress
    memo = []
    for row in range(len(Board)):
        memo.append([0] * len(Board[0]))
    min_distance = []
    best_solution = []
    temp_solution = [Source]
    depth_first_solve(Board, Source, Destination, memo, 0, min_distance, temp_solution, best_solution)

    return best_solution

def depth_first_solve(puzzle, cell_address, destination, memo, current_cost, min_distance, temp_solution, best_solution):

    """
    Helper function for solve_puzzle that performs the recursive work. Depth-first backtracking approach.
    """

    # ------- BASE CASE -------
    if cell_address == destination:
        if not min_distance:
            min_distance.append(current_cost)
            best_solution.extend(copy.deepcopy(temp_solution))
            return
        elif current_cost < min_distance[0]:
            min_distance[0] = current_cost
            best_solution.clear()
            best_solution.extend(copy.deepcopy(temp_solution))
            return
        return

    # -------------------------

    # ---- LOCAL VARIABLES ----
    row = cell_address[0]
    column = cell_address[1]
    cell_val = puzzle[row][column]
    left = (row, column - 1)
    right = (row, column + 1)
    up = (row + 1, column)
    down = (row - 1, column)
    neighbors = [left, right, up, down]
    memo[row][column] = 1
    saved_memo = copy.deepcopy(memo)
    saved_cost = current_cost
    saved_solution = copy.deepcopy(temp_solution)
    # -------------------------

    # ---- RECURSIVE CASE -----

    for neighbor in neighbors:
        # check that neighbor's address is valid
        if 0 <= neighbor[0] < len(puzzle) and 0 <= neighbor[1] < len(puzzle[0]) and puzzle[neighbor[0]][neighbor[1]] == "-":
            # check that neighbor isn't visited:
            if memo[neighbor[0]][neighbor[1]] == 0:
                # update cost and solution, continue checking
                current_cost += 1
                temp_solution.append(neighbor)
                depth_first_solve(puzzle, neighbor, destination, memo, current_cost, min_distance, temp_solution, best_solution)
                memo = saved_memo  # semi-reset memo each time the function returns here
                current_cost = saved_cost  # same reset for cost
                temp_solution = saved_solution  # and for solution set
    return


# TestPuzzle = [
# ['-', '-', '-', '-', '-'],
# ['-', '-', '#', '-', '-'],
# ['-', '-', '-', '-', '-'],
# ['#', '-', '#', '#', '-'],
# ['-', '#', '-', '-', '-']
# ]

# TestPuzzle = [['-', '-', '-', '-', '-'],['-', '-', '#', '-', '-'],['-', '-', '-', '-', '-'],['#', '-', '#', '#', '-'],['-', '#', '-', '-', '-']]

# print(solve_puzzle(TestPuzzle, (0,2), (2,2)))
# print(solve_puzzle(TestPuzzle, (0,0), (4,4)))
# print(solve_puzzle(TestPuzzle, (0,0), (4,0)))

# TestPuzzle2 = [['-', '#', '-', '-', '-'], ['-', '#', '-', '#', '-'], ['-', '-', '-', '#', '-'], ['#', '#', '#', '-', '-'], ['-', '-', '-', '-', '-']]
# ['-', '#', '-', '-', '-'],
# ['-', '#', '-', '#', '-'],
# ['-', '-', '-', '#', '-'],
# ['#', '#', '#', '-', '-'],
# ['-', '-', '-', '-', '-']]
# print(solve_puzzle(TestPuzzle2, (0,0),(4,4)))